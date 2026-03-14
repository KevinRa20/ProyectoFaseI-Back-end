const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// usuarios conectados
const usuarios = new Map();

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // registrar usuario
  socket.on("registrarUsuario", (nombre) => {
    usuarios.set(nombre, socket.id);
    socket.username = nombre;

    console.log("Usuarios conectados:", usuarios);
  });

  // enviar mensaje
  socket.on("enviarMensaje", (data) => {

    const { de, para, texto, fecha } = data;

    const mensaje = {
      de,
      para,
      texto,
      fecha
    };

    const socketDestino = usuarios.get(para);
    const socketOrigen = usuarios.get(de);

    // enviar al receptor
    if (socketDestino) {
      io.to(socketDestino).emit("recibirMensaje", mensaje);
    }

    // enviar al emisor
    if (socketOrigen) {
      io.to(socketOrigen).emit("recibirMensaje", mensaje);
    }

    console.log("Mensaje enviado:", mensaje);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      usuarios.delete(socket.username);
    }

    console.log("Usuario desconectado:", socket.id);
  });

});

server.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});