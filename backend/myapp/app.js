import express from "express";
import { WebSocketServer } from "ws";
import http from "http"

const app = express()

const server = http.createServer(app); //create an HTTP server
// Creating an HTTP server means you are setting up a server that communicates using the HTTP (HyperText Transfer Protocol). It allows the server to handle requests and responses over the web.

server.listen(8080 , ()=>{
  console.log("✅ HTTP Server is running on http://localhost:8080");
})

const wss = new WebSocketServer({server});

wss.on("connection", function connection(ws){

  ws.on('error' , function(error){
    console.log(error , "error during connectio n of new user");
  })

  console.log("✅ New WebSocket Connection Established!");

  ws.on("message" , function message(data , isBinary){
    // console.log("📩 Received:", message.toString());

    wss.clients.forEach(function each(client){
      if(client !== ws && client.readyState === ws.OPEN){ //(client.readyState === ws.OPEN)this is broadcasting the message to every cleint including himself
        // but --> "client !== ws" ensures that the message will not be received by the sender
        // console.log(data , "sendinf");
        
        client.send(data , {binary: isBinary})
      }
    })
  })

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
  
  ws.send("Hello! Message from Server!!")
})