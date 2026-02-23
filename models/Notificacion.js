const mongoose = require("mongoose");

const NotificacionSchema = new mongoose.Schema({
  producto: String,
  mensaje: String,
  comprador: String,
  
});

module.exports = mongoose.model("Notificacion", NotificacionSchema);