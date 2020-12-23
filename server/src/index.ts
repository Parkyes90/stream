import express from "express";
const io = require("socket.io");

const app = express();
const server = app.listen(8000, function () {
  console.log("Listening to Port 8000");
});
type Message = {
  username: string;
  message: string;
};
const socketServer = io(server);

socketServer.on("connection", (socket: any) => {
  socket.on("sendingMessage", (data: Message) => {
    socketServer.emit("broadcastMessage", data);
  });
  socket.on("join", (roomName: string) => {
    const rooms = socketServer.sockets.adapter.rooms;
    const room = rooms.get(roomName);
    console.log(room);

    if (!room) {
      console.log("created");
      socket.join(roomName);
      socket.emit("created");
    } else if (room.size === 1) {
      console.log("joined");
      socket.join(roomName);
      socket.emit("joined");
    } else {
      socket.emit("full");
    }
  });
  socket.on("ready", (roomName: string) => {
    console.log("Ready");
    socket.broadcast.to(roomName).emit("ready");
  });
  socket.on("candidate", (candidate: any, roomName: string) => {
    console.log("Candidate");
    socket.broadcast.to(roomName).emit("candidate", candidate);
  });
  socket.on("offer", (offer: any, roomName: string) => {
    console.log("Offer");
    socket.broadcast.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer: any, roomName: string) => {
    console.log("Answer");
    socket.broadcast.to(roomName).emit("answer", answer);
  });
  console.log("Websocket Connected", socket.id);
});
