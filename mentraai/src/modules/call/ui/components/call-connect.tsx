"use client";

import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { 
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { CallUI } from './call-ui';

interface CallConnectProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({ 
  meetingId, 
  meetingName, 
  userId, 
  userName, 
  userImage 
}: CallConnectProps) => {
  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string>();
  const trpc = useTRPC();
  const initRef = useRef(false);
  const cleanupRef = useRef(false);

  const generateTokenMutation = useMutation({
    ...trpc.meetings.generateToken.mutationOptions(),
    onError: (error) => {
      console.error('[CONNECT] Token generation failed:', error);
      setError('Failed to generate access token');
    }
  });

  useEffect(() => {
    // Prevent multiple initializations
    if (initRef.current) return;
    initRef.current = true;

    const initializeClient = async () => {
      try {
        setError(undefined);
        
        console.log('[CONNECT] Generating token...');
        const { token } = await generateTokenMutation.mutateAsync({ meetingId });
        console.log('[CONNECT] Token generated successfully');
        
        const _client = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
          user: {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        });

        console.log('[CONNECT] StreamVideoClient created');
        setClient(_client);
        setIsInitialized(true);

      } catch (error) {
        console.error('[CONNECT] Failed to initialize client:', error);
        setError('Failed to initialize video client');
      }
    };

    initializeClient();

    // Cleanup function
    return () => {
      console.log('[CONNECT] Component unmounting, cleaning up...');
      cleanupRef.current = true;
      
      // Cleanup will happen in the second useEffect
    };
  }, [meetingId, userId, userName, userImage]);

  useEffect(() => {
    if (!client || !isInitialized) return;

    const initializeCall = async () => {
      try {
        console.log('[CONNECT] Initializing call...');
        const _call = client.call('default', meetingId);
        
        // Disable camera and microphone by default
        console.log('[CONNECT] Disabling camera and mic by default');
        await _call.camera.disable();
        await _call.microphone.disable();
        
        console.log('[CONNECT] Call initialized');
        setCall(_call);

      } catch (error) {
        console.error('[CONNECT] Failed to initialize call:', error);
        setError('Failed to initialize call');
      }
    };

    initializeCall();

    return () => {
      if (cleanupRef.current && call && client) {
        console.log('[CONNECT] Cleaning up call and client...');
        
        // Proper cleanup sequence
        (async () => {
          try {
            // Stop media tracks
            if (call.camera.state.status === 'enabled') {
              await call.camera.disable();
            }
            if (call.microphone.state.status === 'enabled') {
              await call.microphone.disable();
            }

            // Leave call if still in it
            if (call.state.callingState !== 'left') {
              console.log('[CONNECT] Leaving call during cleanup');
              await call.leave();
            }

            // Disconnect client
            console.log('[CONNECT] Disconnecting client');
            await client.disconnectUser();
            console.log('[CONNECT] Cleanup completed');
            
          } catch (error) {
            console.error('[CONNECT] Error during cleanup:', error);
          }
        })();
      }
    };
  }, [client, isInitialized, meetingId]);

  // Handle browser tab close / refresh
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (call && call.state.callingState !== 'left') {
        console.log('[CONNECT] Page unload detected, cleaning up call');
        
        // Try to leave call
        try {
          await call.camera.disable();
          await call.microphone.disable();
          await call.leave();
          await call.endCall();
        } catch (error) {
          console.error('[CONNECT] Error during unload cleanup:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [call]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!call || !client || !isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">
            {generateTokenMutation.isPending ? 'Authenticating...' : 'Initializing call...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};