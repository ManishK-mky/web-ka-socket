import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./roomPage.css";

function RoomPage() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (roomId.trim() && username.trim()) {
      navigate(`/chat/${roomId}?username=${username}`);
    } else {
      alert("Please enter a Room ID and Username!");
    }
  };

  return (
    <div className="room-page">
      <div className="room-container">
        <h2 className="room-title">📱 Join a Chat Room</h2>
        <input
          type="text"
          className="room-input"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <input
          type="text"
          className="room-input"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="room-button" onClick={joinRoom}>
          Join Room
        </button>
      </div>
    </div>
  );
}

export default RoomPage;
