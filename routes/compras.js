const express = require("express");
const router = express.Router();
const Compra = require("../models/compras");

// Registrar compra
router.post("/", async (req, res) => {
  try {
    const { nombreComprador, producto, cantidad, precio, total } = req.body;

    const nuevaCompra = new Compra({
      nombreComprador,
      producto,
      cantidad,
      precio,
      total
    });

    await nuevaCompra.save();

    res.status(201).json({
      mensaje: "Compra registrada correctamente",
      compra: nuevaCompra
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar la compra",
      error: error.message
    });
  }
});

module.exports = router;