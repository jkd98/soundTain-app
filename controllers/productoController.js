import { unlink } from "node:fs/promises"

import Producto from "../models/Producto.js";

//Funcion para agregar nuevo producto
const aggProducto = async (req, res, next) => {
    //parsear datos
    const producto = new Producto(req.body);

    try {
        // Almacenar registro
        await producto.save();
        res.json({ msg: "Se agrego un producto nuevo" })
    } catch (error) {
        // Atrapar error
        console.log(error);
        next();
    }
}

// Función para listar productos con paginación
const listarProductos = async (req, res, next) => {
    const { pagina: paginaActual = 1 } = req.query;

    try {
        const limit = 10;
        const offset = (paginaActual - 1) * limit;

        // Obtener productos
        const productos = await Producto.find()
            .limit(limit)
            .skip(offset);

        // Contar el total de productos
        const totalProductos = await Producto.countDocuments();

        // Mapear los productos y añadir la URL de la imagen
        const productosConImagen = productos.map(producto => ({
            ...producto._doc,               // Datos del producto
            imagenUrl: obtenerUrlImagen(req, producto.imagen)  // URL de la imagen
        }));

        res.json({
            productos: productosConImagen,
            paginaActual: Number(paginaActual),
            totalPaginas: Math.ceil(totalProductos / limit),
            totalProductos,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al listar productos' });
        next();
    }
};

// Función para obtener los primeros 10 productos
const obtenerProductosNvs = async (req, res) => {
    try {
        // Obtener los primeros 10 productos
        const productos = await Producto.find().limit(10);

        res.json({msg:'ok',productos});  // Devolver los productos como respuesta
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener los productos", productos:[] });
    }
}

// Función para listar un solo producto
const obtenerProducto = async (req, res, next) => {
    const { id } = req.params;
    
    try {        
        // Buscar el producto por su ID
        const producto = await Producto.findById(id);
        
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

         // Agregar la URL de la imagen al producto
         const imagenUrl = obtenerUrlImagen(req, producto.imagen);

        // Enviar el producto encontrado
        res.json({msg:'ok',producto,imag:imagenUrl});

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener el producto',producto:{} });
        next();
    }
};


//Funcion para editar producto
const editarProducto = async (req, res, next) => {
    const { id } = req.params;
    
    try {
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Actualizar campos del producto con los datos del request body
        producto.nombre = req.body.nombre || producto.nombre;
        producto.descripcion = req.body.descripcion || producto.descripcion;
        producto.precio = req.body.precio || producto.precio;

        // Guardar los cambios
        const productoActualizado = await producto.save();
        res.json({ msg: 'Producto actualizado correctamente', producto: productoActualizado });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar producto' });
        next();
    }
};


//Función para eliminar un producto
const eliminarProducto = async (req, res, next) => {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    if (!producto) {
        return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    
    // eliminar imagen 
    await unlink(`public/uploads/${producto.imagen}`);
    
    try {
        // Eliminar el producto
        await producto.deleteOne();
        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar producto' });
        next();
    }
};


//Funcion para subir imagen
const subirImagen = async (req, res, next) => {
    const { id } = req.params;

    const extProducto = await Producto.findById(id);
    if (!extProducto) return next();

    try {
        console.log(req.file);

        extProducto.imagen = req.file.filename;

        await extProducto.save();

        next();

    } catch (error) {
        console.log(error);
        res.json({ msg: "No se econtro el producto" });
        next();
    }
};


const obtenerUrlImagen = (req, imagenNombre) => {
    if (!imagenNombre) return null; // Si no hay imagen, retorna null
    return `${req.protocol}://${req.get('host')}/public/uploads/${imagenNombre}`;
};

export {
    aggProducto,
    subirImagen,
    listarProductos,
    editarProducto,
    eliminarProducto,
    obtenerProducto,
    obtenerProductosNvs
}