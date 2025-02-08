import { useEffect, useState } from "react";
import "./chatScreen.css";
import { BsSendFill } from "react-icons/bs";

function chatScreen() {
  const [socket, setSocket] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080"); // Connect to WebSocket server

    newSocket.onopen = () => {
      console.log("✅ Connection Established");
      // newSocket.send("Hello from Client!");
      setSocket(newSocket);
    };

    newSocket.onmessage = (message) => {
      console.log("📩 Received:", message.data);
      setReceivedMessages((prevMessages) => [
        ...prevMessages,
        { text: message.data, sender: "other" },
      ]);
    };

    newSocket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    newSocket.onclose = () => {
      console.log("⚠️ WebSocket Closed");
      setSocket(null);
    };

    return () => {
      newSocket.close(); // Cleanup when component unmounts
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(newMessage);
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

  return (
    <div className="box-msg">
      <div className="chat-container">
        <h1 className="header-class">Chat It👨‍💻</h1>
        <div className="chat-box">
          {receivedMessages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              <div className={`message ${msg.sender}`}>{msg.text}</div>
              <span className="timestamp">
                {new Date().getHours().toString().padStart(2, "0")}:
                {new Date().getMinutes().toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
        <div className="input-box">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>
            <BsSendFill />
          </button>
        </div>
      </div>
    </div>
  );
}

export default chatScreen;
