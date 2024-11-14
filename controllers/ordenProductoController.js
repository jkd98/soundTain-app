import OrdenProducto from "../models/OrdenCliente.js"; // Usar el nombre correcto del archivo

class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Controlador para listar todos los productos comprados por un cliente
const ordenCliente = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        // Obtener el ID del cliente desde el token de autenticación
        const clienteId = req.usuario._id;
        console.log(clienteId);

        // Buscar todas las órdenes del cliente
        const ordenes = await OrdenProducto.find({ 'cliente.clienteId': clienteId }).populate('productos.productoId');

        // Si no hay órdenes, devolver un mensaje
        if (ordenes.length === 0) {
            respuesta.status = 'error';
            respuesta.msg = "No se encontraron productos comprados por este cliente.";
            return res.json(respuesta);
        }

        // Extraer los productos de las órdenes
        /* const productosComprados = ordenes.flatMap(orden =>
            orden.productos.map(producto => ({
                nombre: producto.productoId.nombre,
                cantidad: producto.cantidad,
                precio: producto.precio
            }))
        ); */

        // Devolver la lista de productos comprados
        respuesta.status = 'success';
        respuesta.msg = "Productos comprados encontrados.";
        respuesta.data = ordenes;
        res.json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = "Hubo un error al obtener los productos.";
        respuesta.data = { error: error.message };
        res.status(500).json(respuesta);
    }
};



export { ordenCliente };
