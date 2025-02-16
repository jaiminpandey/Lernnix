"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';

interface VideoRoomProps {
  roomId: string;
  onLeave?: () => void;
}

export function VideoRoom({ roomId, onLeave }: VideoRoomProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // Initialize WebSocket connection here
        initializeWebSocket();
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    init();
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      Object.values(peerConnections.current).forEach(pc => pc.close());
    };
  }, []);

  const initializeWebSocket = () => {
    // Initialize WebSocket connection for signaling
    const ws = new WebSocket('YOUR_SIGNALING_SERVER_URL');

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'offer':
          handleOffer(data);
          break;
        case 'answer':
          handleAnswer(data);
          break;
        case 'ice-candidate':
          handleIceCandidate(data);
          break;
        case 'user-joined':
          createPeerConnection(data.userId);
          break;
        case 'user-left':
          handleUserLeft(data.userId);
          break;
      }
    };
  };

  const createPeerConnection = (userId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:your-turn-server.com',
          username: 'username',
          credential: 'credential'
        }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to signaling server
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [userId]: event.streams[0]
      }));
    };

    localStream?.getTracks().forEach(track => {
      localStream && pc.addTrack(track, localStream);
    });

    peerConnections.current[userId] = pc;
    return pc;
  };

  const handleOffer = async (data: any) => {
    const pc = createPeerConnection(data.userId);
    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    // Send answer to signaling server
  };

  const handleAnswer = async (data: any) => {
    const pc = peerConnections.current[data.userId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  };

  const handleIceCandidate = async (data: any) => {
    const pc = peerConnections.current[data.userId];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const handleUserLeft = (userId: string) => {
    if (peerConnections.current[userId]) {
      peerConnections.current[userId].close();
      delete peerConnections.current[userId];
    }
    setRemoteStreams(prev => {
      const newStreams = { ...prev };
      delete newStreams[userId];
      return newStreams;
    });
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Class Room: {roomId}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleAudio}
              className={!isAudioEnabled ? "bg-red-100" : ""}
            >
              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVideo}
              className={!isVideoEnabled ? "bg-red-100" : ""}
            >
              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={onLeave}
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
            <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              You
            </span>
          </div>
          {Object.entries(remoteStreams).map(([userId, stream]) => (
            <div key={userId} className="relative aspect-video">
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
                ref={el => {
                  if (el) el.srcObject = stream;
                }}
              />
              <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Participant {userId}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}