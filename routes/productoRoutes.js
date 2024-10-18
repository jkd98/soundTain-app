import express from "express";
import upload from "../middleware/subirImagen.js";

import { aggProducto, subirImagen } from "../controllers/productoController.js";

const router = express.Router();

router.post('/add', aggProducto);
router.post('/add-img/:prod', upload.single('imagen'),subirImagen);




export default router;
