const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let usuarios = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // registrar usuario
  socket.on("registrarUsuario", (nombre) => {
    usuarios[nombre] = socket.id;

    console.log("Usuarios conectados:", usuarios);
  });

  // enviar mensaje
  socket.on("enviarMensaje", (data) => {

    const socketDestino = usuarios[data.para];

    if (socketDestino) {
      io.to(socketDestino).emit("recibirMensaje", data);
    } else {
      console.log("Usuario no conectado:", data.para);
    }
  });

  // desconexión
  socket.on("disconnect", () => {

    for (let usuario in usuarios) {
      if (usuarios[usuario] === socket.id) {
        delete usuarios[usuario];
        break;
      }
    }

    console.log("Usuario desconectado:", socket.id);
  });

});

server.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});