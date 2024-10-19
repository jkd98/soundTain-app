import Producto from "../models/Producto.js";
import Comentario from "../models/Comentario.js";

import { check, validationResult } from "express-validator";



//Funcion para agregar nuevo comentario
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

// Función para listar comentarios por usuario
const listarComentariosPorUsuario = async (req, res, next) => {
    const { _id } = req.usuario;
    
    try {
        const comentarios = await Comentario.find({ usuario: _id }).populate('producto', 'nombre');
        res.json(comentarios);  // Devuelve los comentarios del usuario actual
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al listar comentarios por usuario' });
        next();
    }
};

// Función para listar comentarios por producto
const listarComentariosPorProducto = async (req, res, next) => {
    const { prod } = req.params;
    
    try {
        const comentarios = await Comentario.find({ producto: prod }).populate('usuario', 'nombre');
        res.json(comentarios);  // Devuelve los comentarios del producto
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al listar comentarios por producto' });
        next();
    }
};

// Función para editar un comentario (solo si pertenece al usuario)
const editarComentario = async (req, res, next) => {
    const { id } = req.params;  // ID del comentario a editar
    const { _id } = req.usuario;  // ID del usuario autenticado
    const { calificacion, comentario } = req.body;

    try {
        // Buscar el comentario
        const comentarioExistente = await Comentario.findById(id);
        if (!comentarioExistente) {
            return res.status(404).json({ msg: 'Comentario no encontrado' });
        }

        // Verificar que el comentario pertenece al usuario
        if (comentarioExistente.usuario.toString() !== _id.toString()) {
            return res.status(403).json({ msg: 'No tienes permiso para editar este comentario' });
        }

        // Actualizar los campos
        comentarioExistente.calificacion = calificacion || comentarioExistente.calificacion;
        comentarioExistente.comentario = comentario || comentarioExistente.comentario;

        // Guardar los cambios
        const comentarioActualizado = await comentarioExistente.save();
        res.json({ msg: 'Comentario actualizado correctamente', comentarioActualizado });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar comentario' });
        next();
    }
};

// Función para eliminar un comentario
const eliminarComentario = async (req, res, next) => {
    const { id } = req.params;  // ID del comentario a eliminar
    const { _id } = req.usuario;  // ID del usuario autenticado

    try {
        // Buscar el comentario
        const comentario = await Comentario.findById(id);
        if (!comentario) {
            return res.status(404).json({ msg: 'Comentario no encontrado' });
        }

        // Verificar que el comentario pertenece al usuario
        if (comentario.usuario.toString() !== _id.toString()) {
            return res.status(403).json({ msg: 'No tienes permiso para eliminar este comentario' });
        }

        // Eliminar el comentario
        await comentario.deleteOne();
        res.json({ msg: 'Comentario eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar comentario' });
        next();
    }
};

export {
    aggComentarios,
    listarComentariosPorUsuario,
    listarComentariosPorProducto,
    editarComentario,
    eliminarComentario
};