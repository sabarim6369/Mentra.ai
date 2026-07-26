import { NextRequest, NextResponse } from 'next/server';
import { streamVideo } from '@/lib/stream-video';

export async function POST(req: NextRequest) {
  try {
    const { meetingId, agentId, testMessage = "Hello, can you hear me?" } = await req.json();

    if (!meetingId || !agentId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing meetingId or agentId' 
      }, { status: 400 });
    }

    console.log('=== DIAGNOSTIC TEST STARTED ===');
    console.log('Meeting ID:', meetingId);
    console.log('Agent ID:', agentId);
    console.log('OpenAI API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('OpenAI API Key (first 10 chars):', process.env.OPENAI_API_KEY?.substring(0, 10));

    const results: any = {
      success: false,
      steps: [],
      errors: [],
    };

    try {
      const call = streamVideo.video.call('default', meetingId);
      results.steps.push({ step: 'call_object_created', status: 'success' });
      
      try {
        console.log('Attempting OpenAI connection...');
        const realtimeClient = await streamVideo.video.connectOpenAi({
          call,
          openAiApiKey: process.env.OPENAI_API_KEY!,
          agentUserId: agentId,
          model: 'gpt-4o-realtime-preview-2024-12-17',
        });
        
        console.log('OpenAI client connected successfully');
        results.steps.push({ step: 'openai_connected', status: 'success' });

        try {
          await realtimeClient.updateSession({
            instructions: 'You are a test agent. When someone greets you, respond with "Test successful! I can hear you loud and clear."',
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
          
          console.log('Session updated successfully');
          results.steps.push({ step: 'session_updated', status: 'success' });

          const eventResults: any[] = [];
          
          realtimeClient.on('conversation.updated', (event: any) => {
            console.log('[TEST] conversation.updated');
            eventResults.push({ event: 'conversation.updated', timestamp: new Date().toISOString() });
          });

          realtimeClient.on('conversation.item.completed', (event: any) => {
            console.log('[TEST] conversation.item.completed:', event.item?.type);
            eventResults.push({ 
              event: 'conversation.item.completed', 
              type: event.item?.type,
              timestamp: new Date().toISOString() 
            });
          });

          realtimeClient.on('response.audio_transcript.done', (event: any) => {
            console.log('[TEST] Agent transcript:', event.transcript);
            eventResults.push({ 
              event: 'agent_spoke', 
              transcript: event.transcript,
              timestamp: new Date().toISOString() 
            });
          });

          realtimeClient.on('conversation.item.input_audio_transcription.completed', (event: any) => {
            console.log('[TEST] User transcript:', event.transcript);
            eventResults.push({ 
              event: 'user_spoke', 
              transcript: event.transcript,
              timestamp: new Date().toISOString() 
            });
          });

          realtimeClient.on('error', (error: any) => {
            console.error('[TEST] OpenAI error:', error);
            eventResults.push({ 
              event: 'error', 
              error: error,
              timestamp: new Date().toISOString() 
            });
          });

          results.steps.push({ step: 'event_listeners_setup', status: 'success' });

          try {
            realtimeClient.sendUserMessageContent([
              { type: "input_text", text: testMessage },
            ]);
            
            console.log('Test message sent:', testMessage);
            results.steps.push({ 
              step: 'test_message_sent', 
              status: 'success',
              message: testMessage 
            });

            await new Promise(resolve => setTimeout(resolve, 5000));

            results.events = eventResults;
            results.success = true;
            results.message = 'Diagnostic test completed. Check events for agent response.';

            console.log('=== DIAGNOSTIC TEST COMPLETED ===');
            console.log('Events captured:', eventResults.length);

          } catch (error: any) {
            console.error('Error sending test message:', error);
            results.errors.push({
              step: 'send_message',
              error: error.message,
              stack: error.stack,
            });
          }

        } catch (error: any) {
          console.error('Error updating session:', error);
          results.errors.push({
            step: 'update_session',
            error: error.message,
            stack: error.stack,
          });
        }

      } catch (error: any) {
        console.error('Error connecting to OpenAI:', error);
        results.errors.push({
          step: 'connect_openai',
          error: error.message,
          stack: error.stack,
          details: {
            code: error.code,
            type: error.type,
            statusCode: error.statusCode,
          }
        });
      }

    } catch (error: any) {
      console.error('Error creating call object:', error);
      results.errors.push({
        step: 'create_call',
        error: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Diagnostic test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    configured: {
      openai_api_key: !!process.env.OPENAI_API_KEY,
      stream_api_key: !!process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
      stream_api_secret: !!process.env.STREAM_VIDEO_API_SECRET,
    },
    models: {
      recommended: 'gpt-4o-realtime-preview-2024-12-17',
    },
    instructions: {
      test_endpoint: 'POST /api/diagnostic/agent-test',
      parameters: {
        meetingId: 'string (required)',
        agentId: 'string (required)',
        testMessage: 'string (optional, default: "Hello, can you hear me?")',
      },
      example: {
        curl: `curl -X POST http://localhost:3000/api/diagnostic/agent-test \\
  -H "Content-Type: application/json" \\
  -d '{"meetingId":"test-meeting-123","agentId":"agent-456","testMessage":"Hello agent!"}'`
      }
    }
  });
}