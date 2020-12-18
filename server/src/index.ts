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
    if (!room) {
      socket.join(roomName);
      console.log(`Room "Created"`);
    } else if (room.size === 1) {
      socket.join(roomName);
      console.log(`Room "Joined"}`);
    } else {
      console.log(`Room Full for Now"}`);
    }

    console.log(rooms);
  });

  console.log("Websocket Connected", socket.id);
});
