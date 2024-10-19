import express from "express";

import {
    login,
    registro,
    confirmar,
    resetPasswd,
    comprobarToken,
    cambiarPass
} from "../controllers/authController.js"

const router = express.Router();

// http://localhost:PUERTO/auth/rutas-de-abajo

router.post('/login', login);
router.post('/registro', registro );
router.get('/confirmar/:tkn', confirmar);

router.post('/olvide-passwd', resetPasswd);
router.get('/olvide-passwd/:tkn', comprobarToken);
router.post('/olvide-passwd/:tkn', cambiarPass);

export default router;