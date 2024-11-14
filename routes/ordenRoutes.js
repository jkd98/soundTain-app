import express from "express";
import checkAuth from "../middleware/chekAuth.js";
import { ordenCliente } from "../controllers/ordenProductoController.js"; // Importamos el controlador

const router = express.Router();

// Ruta para listar todos los productos comprados por un cliente
router.get('/historial-compras', checkAuth, ordenCliente);

export default router;
