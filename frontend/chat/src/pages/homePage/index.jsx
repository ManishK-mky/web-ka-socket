import { Link } from "react-router-dom";
import Footer from "../../components/footer";
import "./homePage.css";
import Images from "../../assets/images/Images";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <img
          src="https://images.unsplash.com/photo-1494869042583-f6c911f04b4c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Background"
          className="hero-image"
        />
        <div className="hero-content">
          <h1>AI Chat App</h1>
          <p>Chat securely with end-to-end encryption, group conversations, and AI-powered chatting.</p>
        </div>
      </div>

      {/* Modal Section */}
      <div className="modal-container">
        <div className="modal-card">
          <img src={Images.EndToEnd} alt="End-to-End Chat" />
          <h2>End-to-End Chat</h2>
          <p>Private and secure messaging with encryption.</p>
          <Link to="/chat/room" className="modal-button">Try Now</Link>
        </div>

        <div className="modal-card">
          <img src={Images.GroupChat} alt="Group Chat" />
          <h2>Group Chat</h2>
          <p>Connect with multiple people in real-time.</p>
          <Link to="/chat/group" className="modal-button">Try Now</Link>
        </div>

        <div className="modal-card">
          <img src={Images.ChatBot} alt="AI Chat" />
          <h2>AI Chat</h2>
          <p>Chat with an AI-powered assistant.</p>
          <Link to="/chat/ai" className="modal-button">Try Now</Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
