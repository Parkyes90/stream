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
  socket.on("join", (roomName: string) => {
    const rooms = socketServer.sockets.adapter.socketRooms(socket.id);
    const guests = socketServer.sockets.adapter.sockets(new Set(roomName));
    guests
      .then((res) => {
        console.log(res);
        if (res.size < 2) {
          socket.join(roomName);
          console.log(`Room ${res.size === 0 ? "Created" : "Joined"}`);
        } else {
          console.log("Room Full for Now");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(rooms);
  });

  console.log("Websocket Connected", socket.id);
});
