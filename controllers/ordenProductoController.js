import OrdenProducto from "../models/OrdenCliente.js"; // Usar el nombre correcto del archivo

// Controlador para listar todos los productos comprados por un cliente
const ordenCliente = async (req, res) => {
    try {
        // Obtener el ID del cliente desde el token de autenticación
        const clienteId = req.user._id;

        // Buscar todas las órdenes del cliente
        const ordenes = await OrdenProducto.find({ clienteId }).populate('productos.productoId');

        // Si no hay órdenes, devolver un mensaje
        if (ordenes.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron productos comprados por este cliente." });
        }

        // Extraer los productos de las órdenes
        const productosComprados = ordenes.flatMap(orden => 
            orden.productos.map(producto => ({
                nombre: producto.productoId.nombre,
                cantidad: producto.cantidad,
                precio: producto.precio
            }))
        );

        // Devolver la lista de productos comprados
        res.json(productosComprados);
    } catch (error) {
        res.status(500).json({ mensaje: "Hubo un error al obtener los productos.", error: error.message });
    }
};

export { ordenCliente };
