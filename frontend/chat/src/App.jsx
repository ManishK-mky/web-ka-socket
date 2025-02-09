import React from 'react';
import { Link } from 'react-router-dom';
import HomePage from "./pages/homePage";
import ChatScreen from "./pages/chatScreen";
import RoomPage from './pages/roomPage';
import { Routes , Route } from 'react-router-dom'

function App() {
  return (
   <Routes>
      <Route path="/home" element={<HomePage />}></Route>
      <Route path="chat/room" element={<RoomPage />}></Route>
      <Route path="/chat/:roomID" element={<ChatScreen />}></Route>
      <Route path="/chat/group" element={<h1>Group chat coming soon....</h1>}></Route>
      <Route path="/chat/ai" element={<h1>AI chat Coming Soon</h1>}></Route>
   </Routes>
  )
}

export default App
