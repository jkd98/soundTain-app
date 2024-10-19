import express from "express";
import { agregarAlCarrito, obtenerCarrito, eliminarProductoDelCarrito, vaciarCarrito } from "../controllers/carritoController.js";
import checkAuth from "../middleware/chekAuth.js";

const router = express.Router();

// Ruta para agregar un producto al carrito
router.post("/add", checkAuth, agregarAlCarrito);

// Ruta para obtener el carrito del usuario autenticado
router.get("/", checkAuth, obtenerCarrito);

// Ruta para eliminar un producto del carrito
router.delete("/eliminar", checkAuth, eliminarProductoDelCarrito);

// Ruta para vaciar el carrito
router.delete("/vaciar", checkAuth, vaciarCarrito);

export default router;
