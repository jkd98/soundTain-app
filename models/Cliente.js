import mongoose from "mongoose";
import bcrypt from "bcrypt";

//schema
const clienteSchema = mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true },
        apellido: { type: String, required: true, trim: true },
        pass: { type: String, required: true, trim: true },
        direccion: { type: String, required: true, trim: true }, // Se agrega la direccion del cliente
        email: { type: String, required: true, trim: true, unique: true, lowercase: true },
        phone: { type: String, trim: true },
        token: { type: String },
        confirmado: { type: Boolean, default: false },
        rol:{type:String, default:'Cliente'}
    }, 
    {
        timestamps:true //genera columnas de creado y actualizado
    }
);


/**
 * .pre, es un middleware que se ejecuta antes de almacenar,
 *  
 */
clienteSchema.pre('save', async function(next) {
    // Evita que se ejecute el hash, cada vez que se actualiza el documento. 
    // Solo se ejecuta si el campo 'pass' ha sido modificado
    if(!this.isModified('pass')){
        next(); // pasa al siguiente middleware
    };
    //console.log(this.pass);
    const salt = await bcrypt.genSalt(10); // genara salto de 10 rondas
    // hash
    this.pass = await bcrypt.hash(this.pass,salt); // this.pass hace refencia al objeto que se almacenara
    next();
});

/**
 *  Esto añade un nuevo metodo al schema, que podra
 *  ser utilizado por la instancia 
 */
clienteSchema.methods.comprobarPass = function(passForm){
    const data = bcrypt.compareSync(passForm,this.pass);
    //console.log(data);
    return data;
};




// convertir el esquema a modelo para poderlo trabajar
const Cliente = mongoose.model("Cliente",clienteSchema);

//hacerlo disponible en la aplicación
export default Cliente;