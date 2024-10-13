import Producto from "../models/Producto.js";

//Funcion para agregar nuevo producto
const aggProducto = async (req,res,next)=>{
    //parsear datos
    const producto = new Producto(req.body);

    try {
        // Almacenar registro
        await producto.save();
        res.json({msg:"Se agrego un producto nuevo"})
    } catch (error) {
        // Atrapar error
        console.log(error);
        next();
    }
}

//Funcion para listar productos


//Funcion para editar producto


//Funcion para eliminar un producto

export {
    aggProducto
}