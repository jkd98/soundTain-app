import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

// Función para agregar un producto al carrito
const agregarAlCarrito = async (req, res) => {
    const { productoId, cantidad } = req.body;
    const { _id: usuarioId } = req.usuario;

    try {
        const producto = await Producto.findById(productoId);

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        // Buscar el carrito del usuario
        let carrito = await Carrito.findOne({ usuario: usuarioId });

        if (!carrito) {
            // Crear un nuevo carrito si no existe
            carrito = new Carrito({
                usuario: usuarioId,
                productos: [{ producto: productoId, cantidad, precio: producto.precio }],
                total: producto.precio * cantidad
            });
        } else {
            // Verificar si el producto ya está en el carrito
            const productoEnCarrito = carrito.productos.find(p => p.producto.equals(productoId));

            if (productoEnCarrito) {
                // Si el producto ya está, actualizar la cantidad
                productoEnCarrito.cantidad += cantidad;
                carrito.total += producto.precio * cantidad;
            } else {
                // Si no está, agregar el nuevo producto al carrito
                carrito.productos.push({ producto: productoId, cantidad, precio: producto.precio });
                carrito.total += producto.precio * cantidad;
            }
        }

        await carrito.save();
        res.json(carrito);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al agregar producto al carrito" });
    }
};

// Función para obtener el carrito del usuario
const obtenerCarrito = async (req, res) => {
    const { _id: usuarioId } = req.usuario;

    try {
        const carrito = await Carrito.findOne({ usuario: usuarioId }).populate("productos.producto", "nombre precio");

        if (!carrito) {
            return res.json({ msg: "Carrito vacío" });
        }

        res.json(carrito);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener el carrito" });
    }
};

// Función para eliminar un producto del carrito
const eliminarProductoDelCarrito = async (req, res) => {
    const { productoId } = req.body;
    const { _id: usuarioId } = req.usuario;

    try {
        const carrito = await Carrito.findOne({ usuario: usuarioId });

        if (!carrito) {
            return res.status(404).json({ msg: "Carrito no encontrado" });
        }

        // Filtrar los productos para eliminar el deseado
        carrito.productos = carrito.productos.filter(p => !p.producto.equals(productoId));

        carrito.total = carrito.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

        await carrito.save();
        res.json(carrito);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al eliminar producto del carrito" });
    }
};

// Función para vaciar el carrito
const vaciarCarrito = async (req, res) => {
    const { _id: usuarioId } = req.usuario;

    try {
        const carrito = await Carrito.findOne({ usuario: usuarioId });

        if (!carrito) {
            return res.status(404).json({ msg: "Carrito no encontrado" });
        }

        carrito.productos = [];
        carrito.total = 0;

        await carrito.save();
        res.json({ msg: "Carrito vaciado" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al vaciar el carrito" });
    }
};

export {
    agregarAlCarrito,
    obtenerCarrito,
    eliminarProductoDelCarrito,
    vaciarCarrito
};
