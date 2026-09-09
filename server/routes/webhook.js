const express = require('express');
const { streamVideo } = require('../config/streamVideo');
const Meeting = require('../models/Meeting');
const Agent = require('../models/Agent');

const router = express.Router();

// Store active agent connections
const activeAgentConnections = new Map();

// Verify Stream Video webhook signature
function verifySignature(body, signature) {
  try {
    return streamVideo.verifyWebhook(body, signature);
  } catch (error) {
    console.error('[WEBHOOK] Signature verification failed:', error);
    return false;
  }
}

// Connect AI agent to call using OpenAI Realtime API
async function connectAgentToCall(meetingId, agentId, instructions) {
  try {
    console.log(`[AGENT CONNECTION] Starting connection for meeting ${meetingId}`);
    
    const call = streamVideo.video.call('default', meetingId);
    
    // Connect OpenAI Realtime API through Stream Video SDK
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY,
      agentUserId: agentId,
    });

    console.log(`[AGENT CONNECTION] OpenAI client connected for meeting ${meetingId}`);

    // Set up event listeners for OpenAI events
    realtimeClient.on('conversation.updated', (event) => {
      console.log(`[OPENAI EVENT] conversation.updated for meeting ${meetingId}`);
    });

    realtimeClient.on('conversation.item.created', (event) => {
      console.log(`[OPENAI EVENT] conversation.item.created:`, event.item?.type);
    });

    realtimeClient.on('conversation.item.completed', (event) => {
      console.log(`[OPENAI EVENT] conversation.item.completed:`, event.item?.type);
    });

    realtimeClient.on('response.audio_transcript.done', (event) => {
      console.log(`[OPENAI EVENT] Agent said: "${event.transcript}"`);
    });

    realtimeClient.on('conversation.item.input_audio_transcription.completed', (event) => {
      console.log(`[OPENAI EVENT] User said: "${event.transcript}"`);
    });

    realtimeClient.on('response.done', (event) => {
      console.log(`[OPENAI EVENT] Response completed`);
    });

    realtimeClient.on('input_audio_buffer.speech_started', (event) => {
      console.log(`[OPENAI EVENT] User started speaking`);
    });

    realtimeClient.on('input_audio_buffer.speech_stopped', (event) => {
      console.log(`[OPENAI EVENT] User stopped speaking`);
    });

    realtimeClient.on('error', (error) => {
      console.error(`[OPENAI ERROR] for meeting ${meetingId}:`, error);
    });

    realtimeClient.on('call.session_participant_joined', (event) => {
      const userId = event.participant?.user_id;
      console.log(`[STREAM EVENT] Participant joined: ${userId}`);
    });

    realtimeClient.on('call.session_participant_left', (event) => {
      const userId = event.participant?.user_id;
      console.log(`[STREAM EVENT] Participant left: ${userId}`);
    });

    realtimeClient.on('call.session_ended', async (event) => {
      console.log(`[STREAM EVENT] Call session ended for meeting ${meetingId}`);
      activeAgentConnections.delete(meetingId);
    });

    realtimeClient.on('call.ended', async (event) => {
      console.log(`[STREAM EVENT] Call ended for meeting ${meetingId}`);
      activeAgentConnections.delete(meetingId);
    });

    // Update session with agent instructions and voice settings
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

// POST /api/webhook - Handle Stream Video webhooks
router.post('/', async (req, res) => {
  const signature = req.headers['x-signature'];
  const apiKey = req.headers['x-api-key'];

  console.log('[WEBHOOK] Received webhook request');

  if (!signature || !apiKey) {
    console.error('[WEBHOOK ERROR] Missing signature or API key');
    return res.status(400).json({ error: 'Missing signature or API key' });
  }

  const body = req.text ? await req.text() : JSON.stringify(req.body);
  
  if (!verifySignature(body, signature)) {
    console.error('[WEBHOOK ERROR] Invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch (error) {
    console.error('[WEBHOOK ERROR] Invalid JSON');
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const eventType = payload.type;
  console.log(`[WEBHOOK] Processing event type: ${eventType}`);

  try {
    if (eventType === 'call.session_started') {
      const meetingId = payload.call?.custom?.meetingId;
      
      console.log(`[WEBHOOK] call.session_started for meeting: ${meetingId}`);
      
      if (!meetingId) {
        console.error('[WEBHOOK ERROR] Missing meeting ID in call.session_started');
        return res.status(400).json({ error: 'Missing meeting ID' });
      }

      // Find meeting and check if it can be started
      const meeting = await Meeting.findOne({ 
        id: meetingId,
        status: { $nin: ['completed', 'active', 'cancelled', 'processing'] }
      });

      if (!meeting) {
        console.error(`[WEBHOOK ERROR] Meeting not found or in wrong state: ${meetingId}`);
        return res.status(404).json({ error: 'Meeting not found or already started' });
      }

      // Update meeting status to active
      meeting.status = 'active';
      meeting.startedAt = new Date();
      meeting.updatedAt = new Date();
      await meeting.save();

      console.log(`[WEBHOOK] Meeting ${meetingId} marked as active`);

      // Get agent details
      const agent = await Agent.findOne({ id: meeting.agentId });

      if (!agent) {
        console.error(`[WEBHOOK ERROR] Agent not found: ${meeting.agentId}`);
        return res.status(404).json({ error: 'Agent not found' });
      }

      // Connect agent to call asynchronously
      connectAgentToCall(meetingId, agent.id, agent.instructions)
        .then(() => {
          console.log(`[WEBHOOK] Agent successfully connected to call ${meetingId}`);
        })
        .catch((error) => {
          console.error(`[WEBHOOK] Failed to connect agent to call ${meetingId}:`, error);
        });

      return res.json({ status: 'ok', message: 'Agent connection initiated' });

    } else if (eventType === 'call.session_ended') {
      const meetingId = payload.call?.custom?.meetingId;
      
      console.log(`[WEBHOOK] call.session_ended for meeting: ${meetingId}`);
      
      if (!meetingId) {
        console.error('[WEBHOOK ERROR] Missing meeting ID in call.session_ended');
        return res.status(400).json({ error: 'Missing meeting ID' });
      }

      // Clean up agent connection
      if (activeAgentConnections.has(meetingId)) {
        console.log(`[WEBHOOK] Cleaning up agent connection for meeting ${meetingId}`);
        activeAgentConnections.delete(meetingId);
      }

      // Update meeting status to processing
      const meeting = await Meeting.findOneAndUpdate(
        { id: meetingId, status: 'active' },
        { 
          status: 'processing',
          endedAt: new Date(),
          updatedAt: new Date()
        }
      );

      if (meeting) {
        console.log(`[WEBHOOK] Meeting ${meetingId} marked as processing`);
      }

    } else if (eventType === 'call.transcription_ready') {
      const callCid = payload.call_cid;
      const meetingId = callCid ? callCid.split(':')[1] : null;
      
      console.log(`[WEBHOOK] call.transcription_ready for meeting: ${meetingId}`);
      
      if (!meetingId) {
        console.error('[WEBHOOK ERROR] Missing meeting ID in call.transcription_ready');
        return res.status(400).json({ error: 'Missing meeting ID' });
      }

      const transcriptUrl = payload.call_transcription?.url;
      console.log(`[WEBHOOK] Transcript URL: ${transcriptUrl}`);
      
      // Update meeting with transcript URL
      const meeting = await Meeting.findOneAndUpdate(
        { id: meetingId },
        { 
          transcriptUrl: transcriptUrl,
          updatedAt: new Date(),
          status: 'completed'
        },
        { new: true }
      );

      if (!meeting) {
        console.error(`[WEBHOOK ERROR] Meeting not found for transcript: ${meetingId}`);
        return res.status(404).json({ error: 'Meeting not found' });
      }

      console.log(`[WEBHOOK] Transcript URL saved for meeting ${meetingId}`);
      
      // TODO: Trigger transcript processing (could use Inngest or a background job)
      console.log(`[WEBHOOK] TODO: Implement transcript processing for meeting ${meetingId}`);

    } else if (eventType === 'call.recording_ready') {
      const callCid = payload.call_cid;
      const meetingId = callCid ? callCid.split(':')[1] : null;

      console.log(`[WEBHOOK] call.recording_ready for meeting: ${meetingId}`);

      if (!meetingId) {
        console.error('[WEBHOOK ERROR] Missing meeting ID in call.recording_ready');
        return res.status(400).json({ error: 'Missing meeting ID' });
      }

      const recordingUrl = payload.call_recording?.url;

      // Update meeting with recording URL
      const meeting = await Meeting.findOneAndUpdate(
        { id: meetingId },
        { 
          recordingUrl: recordingUrl,
          updatedAt: new Date()
        },
        { new: true }
      );
      
      if (!meeting) {
        console.error(`[WEBHOOK ERROR] Meeting not found for recording: ${meetingId}`);
        return res.status(404).json({ error: 'Meeting not found' });
      }

      console.log(`[WEBHOOK] Recording URL saved for meeting ${meetingId}`);
    }

    return res.json({ status: 'ok' });

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
