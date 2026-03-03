const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const inventarioRoutes = require("./routes/inventario");
const notificacionesRoutes = require("./routes/notificaciones");


const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/AgroCommerce")
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log(err));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/notificaciones", notificacionesRoutes);


app.listen(5000, () => {
  console.log("Servidor corriendo en puerto 5000");
});
