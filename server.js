const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let usuarios = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("registrarUsuario", (nombre) => {
    usuarios[nombre] = socket.id;
  });

  socket.on("enviarMensaje", (data) => {
    const socketDestino = usuarios[data.para];

    if (socketDestino) {
      io.to(socketDestino).emit("recibirMensaje", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});