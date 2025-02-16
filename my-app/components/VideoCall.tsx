"use client";

import { useEffect, useState } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';

interface VideoCallProps {
  channelName: string;
}

const VideoCall = ({ channelName }: VideoCallProps) => {
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [joinState, setJoinState] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);

  useEffect(() => {
    const init = async () => {
      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setClient(agoraClient);

      // Get token from your token server
      const response = await fetch(`/api/token?channel=${channelName}`);
      const { token, appId } = await response.json();

      if (!token || !appId) {
        console.error('Failed to get token');
        return;
      }

      await agoraClient.join(appId, channelName, token, null);
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      await agoraClient.publish([audioTrack, videoTrack]);
      setJoinState(true);

      agoraClient.on('user-published', async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers(prev => [...prev, user]);
        }
      });

      agoraClient.on('user-unpublished', (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });
    };

    init();
    return () => {
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
      client?.leave();
    };
  }, [channelName]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Local video */}
      {localVideoTrack && (
        <div className="relative">
          <div id="local-player" className="h-[300px] bg-gray-800 rounded-lg overflow-hidden">
            {localVideoTrack && localVideoTrack.play('local-player')}
          </div>
          <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
            You
          </span>
        </div>
      )}

      {/* Remote videos */}
      {remoteUsers.map(user => (
        <div key={user.uid} className="relative">
          <div 
            id={`remote-player-${user.uid}`} 
            className="h-[300px] bg-gray-800 rounded-lg overflow-hidden"
          >
            {user.videoTrack?.play(`remote-player-${user.uid}`)}
          </div>
          <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
            User {user.uid}
          </span>
        </div>
      ))}
    </div>
  );
};

export default VideoCall;