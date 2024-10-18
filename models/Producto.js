import mongoose from "mongoose";

const productoSchema = mongoose.Schema(
    {
        nombre: {type:String, required:true},
        descripcion: {type:String, required:false},
        precio:{type:Number, required:true},
        imagen:{type:String, required:false}
    },
    {
        timestamps:true,
        required:false //genera columnas de creado y actualizado
    }
);

// convertir el esquema a modelo para poderlo trabajar
const Producto = mongoose.model("Producto",productoSchema);

//hacerlo disponible en la aplicación
export default Producto;