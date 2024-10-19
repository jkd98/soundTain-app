import express from "express";

import { 
    editarCliente, 
    eliminarCliente, 
    listarClientes, 
    obtenerCliente, 
} from "../controllers/clienteController.js";

const router = express.Router();

// http://localhost:PUERTO/??????/rutas-de-abajo

router.get('/clientes', listarClientes);
router.get('/clientes/:idC', obtenerCliente);

router.put('/clientes/:idC', editarCliente);

router.delete('/clientes/:idC', eliminarCliente)

export default router;