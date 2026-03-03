import express from "express";
import { crearCompra, obtenerDetalleCompra } from "../Controllers/compraController.js";

const router = express.Router();

router.post("/crearcompra", crearCompra);
router.get("/obtenerdetallecompra", obtenerDetalleCompra);

export default router;