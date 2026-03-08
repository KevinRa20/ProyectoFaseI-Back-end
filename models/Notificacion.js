const mongoose = require("mongoose");

const NotificacionSchema = new mongoose.Schema({
  productor: String,
  producto: String,
  mensaje: String,
  comprador: String, 
  leida: {
    type: Boolean,
    default: false
  },
  fecha: {
  type: Date,
  default: Date.now
  }
});
  
module.exports = mongoose.model("Notificacion", NotificacionSchema);