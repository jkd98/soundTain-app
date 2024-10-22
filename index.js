import  express, { json }  from "express";
import dotenv from 'dotenv';
import cors from "cors"; // permitir coneiones desde el domini del front
import csrf from "csurf";
import cookieParser from "cookie-parser";


import conectarDB from "./config/db.js";

import clienteRouter from "./routes/clienteRoutes.js";
import productoRouter from "./routes/productoRoutes.js";
import authRouter from "./routes/authRoutes.js";
import comentarioRouter from "./routes/comentarioRoutes.js";
import carritoRouter from "./routes/carritoRoutes.js";
<<<<<<< HEAD
import ordenCliente from "./routes/ordenRoutes.js";
=======
import ordenCliente from "./routes/ordenCliente.js";
>>>>>>> ac97fa2ab7b1dd738986d78e8d4d66d824f28a74


// concentra la funcionalidad de express
const app = express();
app.use(express.json()); // para que procese informacion json correctamente

// Habilitar cookie
app.use(cookieParser());

// CSRF
//app.use( csrf({cookie:true}) );

// Esto va a buscar por un archivo .env
dotenv.config()

// conectar a la base de datos
conectarDB();

// Configurar CORS
    // Dominios Permitidos
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    origin:function(origin,callback){
        // Comprobar en la lista blanca
        if(whiteList.includes(origin)){
            // Puede consultar la API
            callback(null,true);
        }else{
            // No esta permitido
            callback(new Error("Error de CORS"));
        };
    }
};

//app.use(cors(corsOptions));

// Routing
/* app.get('/api/usuarios',(req,res)=>{
    res.send('Hola mundo') //send permite mostrar info en la pantalla
    res.json({msg:'ok'}) //  respuesta tipo json para acceder a datos
}) */
app.use('/auth',authRouter); //aqui viene login y regisro y todo eso
app.use('/productos',productoRouter);
app.use('/coment',comentarioRouter);
app.use('/carrito', carritoRouter);
app.use('/ordenCliente', ordenCliente)

// puerto
const PORT = process.env.PORT || 4000; 

app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
