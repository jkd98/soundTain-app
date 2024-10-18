import Producto from "../models/Producto.js";
import Comentario from "../models/Comentario.js";

import { check, validationResult } from "express-validator";



//Funcion para agregar nuevo producto
const aggComentarios = async (req, res, next) => {
    const { prod } = req.params;
    const { _id } = req.usuario;
    const {calificacion,comentario} = req.body;
    
    try {
        //Validar que existe
        const productoExiste = await Producto.findById(prod);
        
        if(!productoExiste) return;
        
        await check('calificacion').isInt({min:0,max:5}).withMessage('Máximo 5 estrellas, mínimo 0').run(req);
        await check('comentario').notEmpty().withMessage('El comentario no puede ir vacío').run(req);
        
        let resultado = validationResult(req);

        // Verificar que no haya errores
        if (!resultado.isEmpty()) {
            // Mostrar Errores
            return res.json(resultado.array());
        }

        let nwComentario = new Comentario({ calificacion, comentario, usuario:_id, producto:productoExiste._id});
        await nwComentario.save();

        res.json({ msg: "ok", nwComentario });
        next();
    } catch (error) {
        console.log(error);
        res.json({msg:"No se encontro el producto"});
        next();
    }

}

//Funcion para listar productos


//Funcion para editar producto


//Funcion para eliminar un producto







export {
    aggComentarios
}