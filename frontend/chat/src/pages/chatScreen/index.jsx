import { useEffect, useState } from "react";
import "./chatScreen.css";
import { BsSendFill } from "react-icons/bs";
import useQueryParams from "../../customHook/urlinfo";
import AIMessage from "../../components/AIMessage";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { HiMiniVideoCamera } from "react-icons/hi2";
import VideoChat from "../../components/videoChat";

function chatScreen({ ws }) {
  const navigate = useNavigate();
  const [showVideoChat, setShowVideoChat] = useState(false);

  const [socket, setSocket] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Extracting roomId and username from URL
  const { params, queryParams } = useQueryParams();
  const username = queryParams.get("username");
  const roomId = params?.roomID;
  console.log(params?.roomID, username);

  useEffect(() => {
    if (!roomId || !username) {
      alert("Room ID and username are required!");
      return;
    }

    const newSocket = new WebSocket(
      `ws://web-ka-socket-1.onrender.com?roomId=${roomId}&username=${username}`
    ); // Connect to WebSocket server

    newSocket.onopen = () => {
      console.log("✅ Connection Established");
      // newSocket.send("Hello from Client!");
      setSocket(newSocket);
      newSocket.send(JSON.stringify({ type: "join", roomId }));
    };

    newSocket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        console.log("🔹 Received message:", data);

        if (data.type === "error") {
          alert(data.message);
          newSocket.close();
        } else if (data.type === "message") {
          setReceivedMessages((prev) => [
            ...prev,
            { text: data.text, sender: "other" },
          ]);
        } else if (data.type === "ai") {
          setReceivedMessages((prev) => [
            ...prev,
            { text: `🤖 AI: ${data.text}`, sender: "ai" },
          ]);
        }
      } catch (error) {
        console.error("❌ Error parsing message:", error);
      }
    };

    newSocket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    newSocket.onclose = () => {
      console.log("⚠️ WebSocket Closed");
      setSocket(null);
    };

    // return () => {
    //   newSocket.close(); // Cleanup when component unmounts
    // };
  }, [roomId, username]);

  const sendMessage = () => {
    if (!newMessage.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "message", text: newMessage }));
      console.log(newMessage);

      setReceivedMessages((prevMessages) => [
        ...prevMessages,
        { text: newMessage, sender: "me" },
      ]);

      setNewMessage(""); //clear input after sending
    } else {
      console.log("❌ WebSocket is not connected");
    }
  };

  //--------------

  const handleBackNavigation = () => {
    navigate(-1);
  };

  return (
    <div className="box-msg">
      <div className="chat-container">
        <div className="chat-header">
          <span className="username">
            <div className="go-back">
              <IoMdArrowRoundBack onClick={handleBackNavigation} />
            </div>
            👨‍💻 {username?.charAt(0).toUpperCase() + username?.slice(1)}
          </span>
          <h1 className="header-class">Chat It </h1>
        </div>
        <div className="chat-box">
          {receivedMessages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              {msg?.sender === "ai" ? (
                <AIMessage message={msg.text} />
              ) : (
                <>
                  <div className={`message ${msg.sender}`}>{msg.text}</div>
                  <span className="timestamp">
                    {new Date().getHours().toString().padStart(2, "0")}:
                    {new Date().getMinutes().toString().padStart(2, "0")}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="input-box">
        <div className="video-icon">
        <HiMiniVideoCamera onClick={() => setShowVideoChat(true)}/>
        {showVideoChat && <VideoChat ws={socket} roomId={roomId} username={username} />}
        </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message... (Use @AI to ask the bot)"
          />
          <button className="chat-send-btn" onClick={sendMessage}>
            <BsSendFill />
          </button>
        </div>
      </div>
    </div>
  );
}

export default chatScreen;
