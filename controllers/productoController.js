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




//Funcion para subir imagen
const subirImagen = async (req,res,next) => {
    const { prod } = req.params;
    
    if(!prod) return next();
    
    
    try {
        const extProducto = await Producto.findById(prod);
        console.log(req.file);
        
        extProducto.imagen = req.file.filename;
        
        await extProducto.save();
        
        next();

    } catch (error) {
        console.log(error);
        res.json({msg:"No se econtro el producto"});
        next();
    }
    


};

export {
    aggProducto,
    subirImagen
}