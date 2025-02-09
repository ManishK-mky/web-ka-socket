import { useEffect, useRef, useState } from "react";
import "./videoChat.css";
import { ImPhoneHangUp } from "react-icons/im";

function VideoChat({ ws, roomId, username }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    if (!ws) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("📤 Sending ICE Candidate:", event.candidate);
        ws.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };

    peerConnection.current.ontrack = (event) => {
        console.log("🎥 Setting remote stream:", event.streams[0]); // Debug log
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });
      })
      .catch((error) => console.error("🚨 Error accessing media devices:", error));

    ws.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      console.log("📩 Received WebRTC Signal:", data); // Debug log

      if (data.type === "offer") {
        console.log("📩 Offer received from caller:", data.offer);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        console.log("📤 Sending answer back to caller:", answer);
        ws.send(JSON.stringify({ type: "answer", answer }));
      }

      if (data.type === "answer") {
        console.log("📩 Answer received from callee:", data.answer);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      if (data.type === "candidate") {
        console.log("📩 ICE Candidate received:", data.candidate);
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    return () => {
      peerConnection.current.close();
    };
  }, [ws]);

  const startCall = async () => {
    try {
      if (!peerConnection.current) {
        peerConnection.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
      }

      const offer = await peerConnection.current.createOffer(); // ✅ Now it works
      await peerConnection.current.setLocalDescription(offer);

      console.log("Offer created:", offer);
      ws.send(JSON.stringify({ type: "offer", offer }));
      
      setIsConnected(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const hangUpCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop()); // Stop all media tracks
    }
    if (peerConnection.current) {
      peerConnection.current.close(); // Close peer connection
    }
    setIsConnected(false);
  };

  return (
    <div className="video-chat">
    {isConnected && (
      <button className="hangup-btn" onClick={hangUpCall}>
        <ImPhoneHangUp size={24} />
      </button>
    )}
    {/* <video ref={localVideoRef} autoPlay playsInline muted /> */}
    <video ref={remoteVideoRef} autoPlay playsInline />
    {!isConnected && <button onClick={startCall} className="start-call-btn">Start Video Call</button>}
  </div>
  );
}

export default VideoChat;
