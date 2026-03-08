const express = require("express");
const router = express.Router();
const Notificacion = require("../models/Notificacion");

router.get("/notificaciones/:comprador", async (req, res) => {
  try {

    const { comprador } = req.params;

    const notificaciones = await Notificacion.find({
      comprador: comprador
    }).sort({ fecha: -1 });

    res.json(notificaciones);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener notificaciones" });
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
      comprador: comprador.toLowerCase()
    });

    await nuevaNotificacion.save();

    res.json({ msg: "Notificación guardada correctamente" });
  } catch (error) {
    console.error("Error al guardar:", error);
    res.status(500).json({ msg: "Error al guardar notificación" });
  }
});

// OBTENER NOTIFICACIONES POR COMPRADOR
router.get("/:comprador", async (req, res) => {
  try {
    const comprador = decodeURIComponent(req.params.comprador).toLowerCase();

    const notificaciones = await Notificacion.find({ comprador })
      .sort({ fecha: -1 }); // más nuevas primero

    res.json(notificaciones);
  } catch (error) {
    console.error("Error al obtener:", error);
    res.status(500).json({ msg: "Error al obtener notificaciones" });
  }
});

module.exports = router;