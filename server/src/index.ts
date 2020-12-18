import express from "express";
import { Server } from "socket.io";
const app = express();
const server = app.listen(8000, function () {
  console.log("Listening to Port 8000");
});
type Message = {
  username: string;
  message: string;
};
const socketServer = new Server(server);

socketServer.on("connection", (socket) => {
  socket.on("sendingMessage", (data: Message) => {
    socketServer.emit("broadcastMessage", data);
  });
  socket.on("join", (roomName: any) => {
    const rooms = socketServer.sockets.adapter.socketRooms(socket.id);
    console.log(rooms);
  });

  console.log("Websocket Connected", socket.id);
});
