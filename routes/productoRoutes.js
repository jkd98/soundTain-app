import express from "express";

import { aggProducto } from "../controllers/productoController.js";

const router = express.Router();

router.post('/add', aggProducto);


export default router;
