import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Función para agregar un producto al carrito
const agregarAlCarrito = async (req, res) => {
    const { productoId, cantidad } = req.body;
    const { _id: usuarioId } = req.usuario;
    let respuesta = new Respuesta();

    try {
        const producto = await Producto.findById(productoId);
        if (!producto) {
            respuesta.status = 'error';
            respuesta.msg = 'Producto no encontrado';
            return res.status(404).json(respuesta);
        }

        let carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            carrito = new Carrito({
                usuario: usuarioId,
                productos: [{ producto: productoId, cantidad, precio: producto.precio }],
                total: producto.precio * cantidad
            });
        } else {
            const productoEnCarrito = carrito.productos.find(p => p.producto.equals(productoId));
            if (productoEnCarrito) {
                productoEnCarrito.cantidad += cantidad;
                carrito.total += producto.precio * cantidad;
            } else {
                carrito.productos.push({ producto: productoId, cantidad, precio: producto.precio });
                carrito.total += producto.precio * cantidad;
            }
        }

        await carrito.save();
        respuesta.status = 'success';
        respuesta.msg = 'Producto agregado al carrito';
        respuesta.data = carrito;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al agregar producto al carrito';
        res.status(500).json(respuesta);
    }
};

// Función para obtener el carrito del usuario
const obtenerCarrito = async (req, res) => {
    const { _id: usuarioId } = req.usuario;
    let respuesta = new Respuesta();

    try {
        const carrito = await Carrito.findOne({ usuario: usuarioId }).populate("productos.producto", "nombre precio");
        if (!carrito) {
            respuesta.status = 'success';
            respuesta.msg = 'Carrito vacío';
            return res.json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Carrito obtenido correctamente';
        respuesta.data = carrito;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener el carrito';
        res.status(500).json(respuesta);
    }
};

// Función para eliminar un producto del carrito
const eliminarProductoDelCarrito = async (req, res) => {
    const { productoId } = req.body;
    const { _id: usuarioId } = req.usuario;
    let respuesta = new Respuesta();

    try {
        const carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            respuesta.status = 'error';
            respuesta.msg = 'Carrito no encontrado';
            return res.status(404).json(respuesta);
        }

        carrito.productos = carrito.productos.filter(p => !p.producto.equals(productoId));
        carrito.total = carrito.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

        await carrito.save();
        respuesta.status = 'success';
        respuesta.msg = 'Producto eliminado del carrito';
        respuesta.data = carrito;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al eliminar producto del carrito';
        res.status(500).json(respuesta);
    }
};

// Función para vaciar el carrito
const vaciarCarrito = async (req, res) => {
    const { _id: usuarioId } = req.usuario;
    let respuesta = new Respuesta();

    try {
        const carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            respuesta.status = 'error';
            respuesta.msg = 'Carrito no encontrado';
            return res.status(404).json(respuesta);
        }

        carrito.productos = [];
        carrito.total = 0;

        await carrito.save();
        respuesta.status = 'success';
        respuesta.msg = 'Carrito vaciado';
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al vaciar el carrito';
        res.status(500).json(respuesta);
    }
};

export {
    agregarAlCarrito,
    obtenerCarrito,
    eliminarProductoDelCarrito,
    vaciarCarrito
};
