import { NextRequest, NextResponse } from 'next/server';
import { 
  CallEndedEvent, 
  CallTranscriptionReadyEvent, 
  CallRecordingReadyEvent, 
  CallSessionStartedEvent 
} from '@stream-io/node-sdk';
import { and, eq, not } from 'drizzle-orm';
import { db } from '@/db';
import { meetings, agents } from '@/db/schema';
import { streamVideo } from '@/lib/stream-video';
import { inngest } from "@/inngest/client";

const activeAgentConnections = new Map<string, any>();

function verifySignatureWithSdk(body: string, signature: string): boolean {
  try {
    return streamVideo.verifyWebhook(body, signature);
  } catch {
    return false;
  }
}

async function connectAgentToCall(meetingId: string, agentId: string, instructions: string) {
  try {
    console.log(`[AGENT CONNECTION] Starting connection for meeting ${meetingId}`);
    
    const call = streamVideo.video.call('default', meetingId);
    
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: agentId,
    });

    console.log(`[AGENT CONNECTION] OpenAI client connected for meeting ${meetingId}`);

    realtimeClient.on('conversation.updated', (event: any) => {
      console.log(`[OPENAI EVENT] conversation.updated for meeting ${meetingId}`);
    });

    realtimeClient.on('conversation.item.created', (event: any) => {
      console.log(`[OPENAI EVENT] conversation.item.created:`, event.item?.type);
    });

    realtimeClient.on('conversation.item.completed', (event: any) => {
      console.log(`[OPENAI EVENT] conversation.item.completed:`, event.item?.type);
    });

    realtimeClient.on('response.audio_transcript.done', (event: any) => {
      console.log(`[OPENAI EVENT] Agent said: "${event.transcript}"`);
    });

    realtimeClient.on('conversation.item.input_audio_transcription.completed', (event: any) => {
      console.log(`[OPENAI EVENT] User said: "${event.transcript}"`);
    });

    realtimeClient.on('response.done', (event: any) => {
      console.log(`[OPENAI EVENT] Response completed`);
    });

    realtimeClient.on('input_audio_buffer.speech_started', (event: any) => {
      console.log(`[OPENAI EVENT] User started speaking`);
    });

    realtimeClient.on('input_audio_buffer.speech_stopped', (event: any) => {
      console.log(`[OPENAI EVENT] User stopped speaking`);
    });

    realtimeClient.on('error', (error: any) => {
      console.error(`[OPENAI ERROR] for meeting ${meetingId}:`, error);
    });

    realtimeClient.on('call.session_participant_joined', (event: any) => {
      const userId = event.participant?.user_id;
      console.log(`[STREAM EVENT] Participant joined: ${userId}`);
    });

    realtimeClient.on('call.session_participant_left', (event: any) => {
      const userId = event.participant?.user_id;
      console.log(`[STREAM EVENT] Participant left: ${userId}`);
    });

    realtimeClient.on('call.session_ended', async (event: any) => {
      console.log(`[STREAM EVENT] Call session ended for meeting ${meetingId}`);
      activeAgentConnections.delete(meetingId);
    });

    realtimeClient.on('call.ended', async (event: any) => {
      console.log(`[STREAM EVENT] Call ended for meeting ${meetingId}`);
      activeAgentConnections.delete(meetingId);
    });

    await realtimeClient.updateSession({
      instructions,
      voice: 'alloy',
      turn_detection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500,
      },
      input_audio_transcription: {
        model: 'whisper-1',
      },
    });

    console.log(`[AGENT CONNECTION] Session updated with instructions`);
    console.log(`[AGENT CONNECTION] Turn detection enabled (server_vad)`);
    console.log(`[AGENT CONNECTION] Agent is now listening for user audio`);

    activeAgentConnections.set(meetingId, realtimeClient);

    console.log(`[AGENT CONNECTION] Successfully connected agent for meeting ${meetingId}`);
    
    return realtimeClient;
  } catch (error) {
    console.error(`[AGENT CONNECTION ERROR] Failed to connect agent for meeting ${meetingId}:`, error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-signature');
  const apiKey = req.headers.get('x-api-key');

  console.log('[WEBHOOK] Received webhook request');

  if (!signature || !apiKey) {
    console.error('[WEBHOOK ERROR] Missing signature or API key');
    return NextResponse.json({ error: 'Missing signature or API key' }, { status: 400 });
  }

  const body = await req.text();
  
  if (!verifySignatureWithSdk(body, signature)) {
    console.error('[WEBHOOK ERROR] Invalid signature');
    console.error('[WEBHOOK DEBUG] Signature (first 20 chars):', signature.substring(0, 20));
    console.error('[WEBHOOK DEBUG] Body length:', body.length);
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch (error) {
    console.error('[WEBHOOK ERROR] Invalid JSON');
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;
  console.log(`[WEBHOOK] Processing event type: ${eventType}`);

  if (eventType === 'call.session_started') {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;
    
    console.log(`[WEBHOOK] call.session_started for meeting: ${meetingId}`);
    
    if (!meetingId) {
      console.error('[WEBHOOK ERROR] Missing meeting ID in call.session_started');
      return NextResponse.json({ error: 'Missing meeting ID' }, { status: 400 });
    }

    const existingMeeting = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, 'completed')),
          not(eq(meetings.status, 'active')),
          not(eq(meetings.status, 'cancelled')),
          not(eq(meetings.status, 'processing'))
        )
      )
      .limit(1);

    if (!existingMeeting.length) {
      console.error(`[WEBHOOK ERROR] Meeting not found or in wrong state: ${meetingId}`);
      return NextResponse.json({ error: 'Meeting not found or already started' }, { status: 404 });
    }

    await db
      .update(meetings)
      .set({ 
        status: 'active',
        startedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(meetings.id, meetingId));

    console.log(`[WEBHOOK] Meeting ${meetingId} marked as active`);

    const agentId = existingMeeting[0].agentId;
    if (!agentId) {
      console.error('[WEBHOOK ERROR] Agent ID not found');
      return NextResponse.json({ error: 'Agent ID not found' }, { status: 400 });
    }

    const agent = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (!agent.length) {
      console.error(`[WEBHOOK ERROR] Agent not found: ${agentId}`);
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    connectAgentToCall(meetingId, agentId, agent[0].instructions)
      .then(() => {
        console.log(`[WEBHOOK] Agent successfully connected to call ${meetingId}`);
      })
      .catch((error) => {
        console.error(`[WEBHOOK] Failed to connect agent to call ${meetingId}:`, error);
      });

    return NextResponse.json({ status: 'ok', message: 'Agent connection initiated' });

  } else if (eventType === 'call.session_ended') {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;
    
    console.log(`[WEBHOOK] call.session_ended for meeting: ${meetingId}`);
    
    if (!meetingId) {
      console.error('[WEBHOOK ERROR] Missing meeting ID in call.session_ended');
      return NextResponse.json({ error: 'Missing meeting ID' }, { status: 400 });
    }

    if (activeAgentConnections.has(meetingId)) {
      console.log(`[WEBHOOK] Cleaning up agent connection for meeting ${meetingId}`);
      activeAgentConnections.delete(meetingId);
    }

    await db
      .update(meetings)
      .set({ 
        status: 'processing',
        endedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, 'active')));

    console.log(`[WEBHOOK] Meeting ${meetingId} marked as processing`);

  } else if (eventType === 'call.transcription_ready') {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(':')[1];
    
    console.log(`[WEBHOOK] call.transcription_ready for meeting: ${meetingId}`);
    
    if (!meetingId) {
      console.error('[WEBHOOK ERROR] Missing meeting ID in call.transcription_ready');
      return NextResponse.json({ error: 'Missing meeting ID' }, { status: 400 });
    }

    const url = event.call_transcription.url;
    console.log(`[WEBHOOK] Transcript URL: ${url}`);
    
    try {
      const updateMeeting = await db
        .update(meetings)
        .set({ 
          transcriptUrl: url,
          updatedAt: new Date(),
          status: 'completed',
        })
        .where(eq(meetings.id, meetingId))
        .returning();

      if (!updateMeeting.length) {
        console.error(`[WEBHOOK ERROR] Meeting not found for transcript: ${meetingId}`);
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
      }

      console.log(`[WEBHOOK] Sending Inngest event for transcript processing`);

      await inngest.send({
        name: 'meetings/processing',
        data: {
          meetingId,
          transcriptUrl: url
        }
      });

      console.log(`[WEBHOOK] Inngest event sent successfully`);

    } catch (error) {
      console.error('[WEBHOOK ERROR] Error updating meeting with transcript:', error);
      return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 });
    }

  } else if (eventType === 'call.recording_ready') {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(':')[1];

    console.log(`[WEBHOOK] call.recording_ready for meeting: ${meetingId}`);

    if (!meetingId) {
      console.error('[WEBHOOK ERROR] Missing meeting ID in call.recording_ready');
      return NextResponse.json({ error: 'Missing meeting ID' }, { status: 400 });
    }

    const updateMeeting = await db
      .update(meetings)
      .set({ 
        recordingUrl: event.call_recording.url,
        updatedAt: new Date()
      })
      .where(eq(meetings.id, meetingId))
      .returning();
    
    if (!updateMeeting.length) {
      console.error(`[WEBHOOK ERROR] Meeting not found for recording: ${meetingId}`);
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    console.log(`[WEBHOOK] Recording URL saved for meeting ${meetingId}`);
  }

  return NextResponse.json({ status: 'ok' });
}
