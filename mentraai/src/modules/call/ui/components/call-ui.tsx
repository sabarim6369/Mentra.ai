"use client";

import { useState, useRef } from 'react';
import { StreamTheme, useCall } from '@stream-io/video-react-sdk';
import { CallLobby } from './call-lobby';
import { CallActive } from './call-active';
import { CallEnded } from './call-ended';

type ShowState = 'lobby' | 'call' | 'ended';

interface CallUIProps {
  meetingName: string;
}

export const CallUI = ({ meetingName }: CallUIProps) => {
  const [show, setShow] = useState<ShowState>('lobby');
  const [hasMic, setHasMic] = useState(false);
  const call = useCall();
  const isJoiningRef = useRef(false);
  const isLeavingRef = useRef(false);

  const handleJoin = async (hasMicrophone: boolean) => {
    if (!call || isJoiningRef.current) {
      console.log('[UI] Cannot join - already joining or no call');
      return;
    }
    
    isJoiningRef.current = true;
    setHasMic(hasMicrophone);
    
    try {
      console.log('[UI] Joining call...');
      await call.join();
      console.log('[UI] Successfully joined call');
      setShow('call');
    } catch (error) {
      console.error('[UI] Failed to join call:', error);
      isJoiningRef.current = false;
    }
  };

  const handleLeave = async () => {
    if (!call || isLeavingRef.current) {
      console.log('[UI] Already leaving or no call');
      setShow('ended');
      return;
    }

    isLeavingRef.current = true;
    console.log('[UI] Leave requested');

    try {
      // Stop media first
      console.log('[UI] Stopping media tracks...');
      if (call.camera.state.status === 'enabled') {
        await call.camera.disable();
      }
      try {
        if (call.microphone.state.status === 'enabled') {
          await call.microphone.disable();
        }
      } catch (micError) {
        console.warn('[UI] Microphone disable failed (no device?):', micError);
      }

      // Leave the call
      if (call.state.callingState !== 'left') {
        console.log('[UI] Leaving call...');
        await call.leave();
      }

      // End the call (triggers webhook)
      console.log('[UI] Ending call...');
      await call.endCall();
      
      console.log('[UI] Call ended successfully');
    } catch (error) {
      console.error('[UI] Error leaving call:', error);
    } finally {
      // Always navigate to ended screen
      console.log('[UI] Showing call ended screen');
      setShow('ended');
    }
  };

  return (
    <StreamTheme>
      <div className="min-h-screen bg-black">
        {show === 'lobby' && (
          <CallLobby onJoin={handleJoin} />
        )}
        
        {show === 'call' && (
          <CallActive 
            onLeave={handleLeave} 
            meetingName={meetingName}
            hasMic={hasMic}
          />
        )}
        
        {show === 'ended' && (
          <CallEnded />
        )}
      </div>
    </StreamTheme>
  );
};