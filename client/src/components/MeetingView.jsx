import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  StreamVideo, 
  StreamCall, 
  StreamVideoClient
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { meetingsAPI } from '../api/meetings';
import { Video, Mic, MicOff, Camera, CameraOff, Phone, PhoneOff } from 'lucide-react';

// Lobby Component
const CallLobby = ({ onJoin, meetingName }) => {
  const [hasMic, setHasMic] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setHasMic(devices.some(d => d.kind === 'audioinput'));
        setHasCamera(devices.some(d => d.kind === 'videoinput'));
      } catch (err) {
        console.error('Error checking devices:', err);
      }
    };
    checkDevices();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white max-w-md">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Video className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{meetingName}</h1>
        <p className="text-gray-400 mb-8">
          {hasMic && hasCamera 
            ? 'Ready to join with microphone and camera' 
            : hasMic 
            ? 'Ready to join with microphone' 
            : hasCamera 
            ? 'Ready to join with camera' 
            : 'Ready to join (no media devices detected)'}
        </p>
        <button
          onClick={() => onJoin(hasMic)}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-medium text-lg transition-colors"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
};

// Active Call Component
const CallActive = ({ call, onLeave, meetingName, hasMic }) => {
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (call) {
      const updateParticipants = () => {
        const state = call.state;
        const participantList = Object.values(state.participants || {});
        setParticipants(participantList);
      };

      updateParticipants();
      call.on('call.participant_joined', updateParticipants);
      call.on('call.participant_left', updateParticipants);

      return () => {
        call.off('call.participant_joined', updateParticipants);
        call.off('call.participant_left', updateParticipants);
      };
    }
  }, [call]);

  const toggleMic = async () => {
    try {
      if (micEnabled) {
        await call.microphone.disable();
      } else {
        await call.microphone.enable();
      }
      setMicEnabled(!micEnabled);
    } catch (err) {
      console.error('Error toggling microphone:', err);
    }
  };

  const toggleCamera = async () => {
    try {
      if (cameraEnabled) {
        await call.camera.disable();
      } else {
        await call.camera.enable();
      }
      setCameraEnabled(!cameraEnabled);
    } catch (err) {
      console.error('Error toggling camera:', err);
    }
  };

  const handleLeave = async () => {
    try {
      await call.leave();
      await call.endCall();
      onLeave();
    } catch (err) {
      console.error('Error leaving call:', err);
      onLeave();
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-white text-xl font-semibold">{meetingName}</h1>
        <p className="text-gray-400 text-sm">
          {participants.length} participant(s)
        </p>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {participants.map((participant) => (
            <div
              key={participant.sessionId}
              className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video"
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    {participant.name?.charAt(0) || '?'}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                {participant.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-800 flex justify-center gap-4">
        {hasMic && (
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full ${
              micEnabled ? 'bg-gray-600' : 'bg-red-600'
            } hover:opacity-80 transition-opacity`}
          >
            {micEnabled ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
          </button>
        )}
        
        <button
          onClick={handleLeave}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

// Ended Component
const CallEnded = ({ onHome }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white max-w-md">
        <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <PhoneOff className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Meeting Ended</h1>
        <p className="text-gray-400 mb-8">Your call has ended successfully.</p>
        <button
          onClick={onHome}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-medium text-lg transition-colors"
        >
          Back to Meetings
        </button>
      </div>
    </div>
  );
};

// Main MeetingView Component
const MeetingView = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [callState, setCallState] = useState('lobby'); // lobby, active, ended
  const [hasMic, setHasMic] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const initializeCall = async () => {
      try {
        setLoading(true);
        
        // Fetch meeting details
        const meetingData = await meetingsAPI.getById(meetingId);
        setMeeting(meetingData);

        // Generate token
        const { token } = await meetingsAPI.generateToken(meetingId, user.id);

        // Create Stream Video client
        const _client = new StreamVideoClient({
          apiKey: process.env.VITE_STREAM_VIDEO_API_KEY,
          user: {
            id: user.id,
            name: user.name || user.email,
            image: user.image,
          },
          token,
        });

        setClient(_client);

        // Initialize call
        const _call = _client.call('default', meetingId);
        await _call.join();
        setCall(_call);
        setCallState('lobby');

      } catch (err) {
        console.error('Error initializing call:', err);
        setError('Failed to initialize meeting. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeCall();

    // Cleanup
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [meetingId, user.id]);

  const handleJoin = (hasMicrophone) => {
    setHasMic(hasMicrophone);
    setCallState('active');
  };

  const handleLeave = () => {
    setCallState('ended');
  };

  const handleHome = () => {
    navigate('/meetings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Initializing meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 border-4 border-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleHome}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p>Unable to connect to meeting</p>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        {callState === 'lobby' && (
          <CallLobby onJoin={handleJoin} meetingName={meeting?.name} />
        )}
        {callState === 'active' && (
          <CallActive call={call} onLeave={handleLeave} meetingName={meeting?.name} hasMic={hasMic} />
        )}
        {callState === 'ended' && (
          <CallEnded onHome={handleHome} />
        )}
      </StreamCall>
    </StreamVideo>
  );
};

export default MeetingView;
