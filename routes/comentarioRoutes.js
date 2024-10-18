import express from "express";
import checkAuth from "../middleware/chekAuth.js";


import {
    aggComentarios
} from "../controllers/comentariosController.js";

const router = express.Router();

router.post('/:prod',checkAuth,aggComentarios);

export default router;