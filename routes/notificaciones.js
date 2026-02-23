const express = require("express");
const router = express.Router();
const Notificacion = require("../models/Notificacion");

// Guardar notificación
router.post("/", async (req, res) => {
  try {
    const nuevaNotificacion = new Notificacion(req.body);
    await nuevaNotificacion.save();
    res.json({ msg: "Notificación guardada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al guardar notificación" });
  }
});

// Obtener notificaciones de un comprador
router.get("/:comprador", async (req, res) => {
  try {
    const notificaciones = await Notificacion.find({ comprador: req.params.comprador });
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener notificaciones" });
  }
});

module.exports = router;