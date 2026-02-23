const express = require("express");
const router = express.Router();
const Inventario = require("../models/Inventario");

// CREATE
router.post("/", async (req, res) => {
  try {
    const nuevo = new Inventario(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al guardar", error });
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const datos = await Inventario.find();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener inventario", error });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Inventario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar", error });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await Inventario.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar", error });
  }
});

module.exports = router;