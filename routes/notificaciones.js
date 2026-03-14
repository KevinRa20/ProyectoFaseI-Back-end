const express = require("express");
const router = express.Router();
const Notificacion = require("../models/Notificacion");

// OBTENER NOTIFICACIONES POR COMPRADOR
router.get("/:comprador", async (req, res) => {
  try {

    const comprador = decodeURIComponent(req.params.comprador).toLowerCase();

    const notificaciones = await Notificacion
      .find({ comprador })
      .sort({ fecha: -1 });

    res.json(notificaciones);

  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ msg: "Error al obtener notificaciones" });
  }
});


// GUARDAR NOTIFICACIÓN
router.post("/", async (req, res) => {

  const { productor, producto, mensaje, comprador } = req.body;

  if (!productor || !producto || !mensaje || !comprador) {
    return res.status(400).json({ msg: "Datos incompletos" });
  }

  try {

    const nuevaNotificacion = new Notificacion({
      productor,
      producto,
      mensaje,
      comprador: comprador.toLowerCase(),
      fecha: new Date()
    });

    await nuevaNotificacion.save();

    res.json({ msg: "Notificación guardada correctamente" });

  } catch (error) {

    console.error("Error al guardar:", error);
    res.status(500).json({ msg: "Error al guardar notificación" });

  }

});

module.exports = router;