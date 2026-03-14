const mongoose = require("mongoose");

const compraSchema = new mongoose.Schema({
  nombreComprador: { type: String, required: true },
  producto: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true },
  total: { type: Number, required: true },
  fechaCompra: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Compras", compraSchema);