const mongoose = require("mongoose");

const InventarioSchema = new mongoose.Schema(
  {
    idProducto: {
      type: String,
      required: true
    },
    nombreProducto: {
      type: String,
      required: true
    },
    fechaCosecha: {
      type: Date,
      required: true
    },
    estado: {
      type: String,
      enum: ["Disponible", "Agotado", "En proceso"],
      default: "Disponible",
      required: true
    }
  },
  {
    collection: "Inventariosproductos", 
    timestamps: true
  }
);

module.exports = mongoose.model("Inventario", InventarioSchema);