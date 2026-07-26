"use client";

import { useEffect, useRef } from 'react';
import {
  SpeakerLayout,
  CallControls,
  useCall,
  CallingState,
} from '@stream-io/video-react-sdk';

interface CallActiveProps {
  onLeave: () => void;
  meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: CallActiveProps) => {
  const call = useCall();
  const isLeavingRef = useRef(false);

  useEffect(() => {
    if (!call) return;

    const handleCallEnd = () => {
      console.log('[CALL] Call ended event received');
      if (!isLeavingRef.current) {
        onLeave();
      }
    };

    const handleCallLeft = () => {
      console.log('[CALL] Call left event received');
      if (!isLeavingRef.current) {
        onLeave();
      }
    };

    call.on('call.ended', handleCallEnd);
    call.on('call.session_participant_left', handleCallLeft);

    return () => {
      call.off('call.ended', handleCallEnd);
      call.off('call.session_participant_left', handleCallLeft);
    };
  }, [call, onLeave]);

  const handleLeaveCall = async () => {
    if (!call || isLeavingRef.current) {
      console.log('[CALL] Already leaving or no call object');
      return;
    }

    isLeavingRef.current = true;
    console.log('[CALL] User clicked leave call button');
    console.log('[CALL] Current calling state:', call.state.callingState);

    try {
      // Stop all media tracks first
      console.log('[CALL] Stopping camera...');
      await call.camera.disable();
      
      console.log('[CALL] Stopping microphone...');
      await call.microphone.disable();

      // Leave the call
      if (call.state.callingState !== CallingState.LEFT) {
        console.log('[CALL] Leaving call...');
        await call.leave();
        console.log('[CALL] Successfully left the call');
      }

      // End the call (this triggers the webhook)
      console.log('[CALL] Ending call session...');
      await call.endCall();
      console.log('[CALL] Call session ended');

    } catch (error) {
      console.error('[CALL ERROR] Error during call cleanup:', error);
    } finally {
      // Navigate away regardless of errors
      console.log('[CALL] Navigating to call ended page');
      onLeave();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
          <h2 className="text-lg font-semibold text-center">{meetingName}</h2>
        </div>
      </div>

      <div className="h-screen flex flex-col">
        <div className="flex-1">
          <SpeakerLayout />
        </div>
        
        <div className="p-4">
          <CallControls onLeave={handleLeaveCall} />
        </div>
      </div>
    </div>
  );
};