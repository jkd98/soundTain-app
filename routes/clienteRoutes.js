import express from "express";

import { 
    editarCliente, 
    eliminarCliente, 
    listarClientes, 
    login, 
    obtenerCliente, 
    resetPasswd, 
    registro, 
    confirmar,
    comprobarToken,
    cambiarPass
} from "../controllers/clienteController.js";

const router = express.Router();

router.post('/login', login);
router.post('/registro', registro );
router.post('/olvide-passwd', resetPasswd);
router.post('/olvide-passwd/:tkn', cambiarPass);

router.get('/clientes', listarClientes);
router.get('/clientes/:idC', obtenerCliente);
router.get('/confirmar/:tkn', confirmar);
router.get('/olvide-passwd/:tkn', comprobarToken);

router.put('/clientes/:idC', editarCliente);

router.delete('/clientes/:idC', eliminarCliente)

export default router;