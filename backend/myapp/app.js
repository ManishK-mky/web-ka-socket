import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai";
import url from "url";

dotenv.config()

const app = express();
const server = http.createServer(app); //create an HTTP server
// Creating an HTTP server means you are setting up a server that communicates using the HTTP (HyperText Transfer Protocol). It allows the server to handle requests and responses over the web.

server.listen(8080, () => {
  console.log("✅ HTTP Server is running on http://localhost:8080");
});

const wss = new WebSocketServer({ server });
const rooms = {}; //roomId: [user1, user2]

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function getAIResponse(prompt){
  console.log(prompt , "prompt");
  
  try{
    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    const result = await model.generateContent(prompt);
    return result.response.text()
  }catch(err){
    console.error("AI Error:" ,err)
    return "I'm sorry, I could not process that request";
  }
}

wss.on("connection", function connection(ws , req) {

  const { query } = url.parse(req.url, true);
  let { roomId, username } = query;

  let userId = uuidv4(); //generate a unique ID for user
  // let roomId = null;

  // if (!rooms[roomId]) rooms[roomId] = [];
  ws.on("error", function (error) {
    console.log(error, "error during connectio n of new user");
  });

  console.log("✅ New WebSocket Connection Established!");

  ws.on("message", async function message(data, isBinary) {
    try {
      const parsedData = JSON.parse(data.toString());

      if (parsedData.type === "join") {
        roomId = parsedData?.roomId;

        if (!rooms[roomId]) {
          rooms[roomId] = [];
        }

        // rooms is an object → { roomId1: [ws1, ws2], roomId2: [ws3, ws4], ... }
        // If roomId does not exist in rooms, we initialize it as an empty array ([]).
        // This ensures that every room can store its own connected WebSocket clients.

        if(rooms[roomId].length >= 2){
          ws.send(JSON.stringify({type: "error", message: "Room is full"}))
          ws.close();
          return;
        }

        rooms[roomId].push(ws)
        console.log(`User joined room: ${roomId}, Users: ${rooms[roomId].length}`);

        if (rooms[roomId].length === 2) {
          rooms[roomId].forEach((client) =>
            client.send(JSON.stringify({ type: "info", message: "Chat started!" }))
          );
        }
      }
      else if (parsedData.type === "message") {

        const messageText = parsedData.text.trim()
        console.log(messageText , ">>>");
        
        console.log(messageText.toLowerCase().startsWith("@ai") , "<<<");
        
        if(messageText.toLowerCase().startsWith("@ai")){
          const aiResponse = await getAIResponse(messageText.replace("@ai","").trim());
          console.log(aiResponse , ">>>aiResponse");
          
          ws.send(JSON.stringify({type: "ai", text: aiResponse}))
          return
        }

        // Forward message only to the other user in the same room
        rooms[roomId]?.forEach((client) => {
          if (client !== ws) {
            client.send(data, { binary: isBinary });
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
    if (roomId && rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((client) => client !== ws);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  })

  ws.send("Hello! Message from Server!!");
});
