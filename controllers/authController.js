import Cliente from "../models/Cliente.js";

import { check, validationResult } from "express-validator";
import generarId from "../helpers/generarId.js"
import { emailOlvidePassw, emailResgistro } from "../helpers/email.js";
import generarJWT from "../helpers/generarJWT.js";


//Funcion para iniciar sesión
const login = async (req, res, next) => {
    const {email,pass} = req.body;
    
    try {
        await check('email').isEmail().withMessage('Email Obligatorio').run(req);
        await check('pass').notEmpty().withMessage('Password Obligatorio').run(req);

        let resultdado = validationResult(req);

        // Verificar que no haya errores
        if (!resultdado.isEmpty()) {
            // Mostrar Errores
            return res.json(resultdado.array());
        }

        // Comprobar si existe
        const cliente = await Cliente.findOne({email});
        
        if(!cliente){
            return res.json({msg:"Ususario no encontrado"});
        }

        // Comprobar si esta confirmada la cuenta
        if(!cliente.confirmado) {
            return res.json({msg:"Tu cuenta no ha sido confirmada"});
        }

        //revisar password
        if(!await cliente.comprobarPass(pass)){
            return res.json({msg:"Contraseña incorrecta"});
        }

        // Crear token y almacenarlo en cookie
        const jwtkn = generarJWT(cliente._id);
        res.cookie('_tkn',jwtkn,{httpOnly:true});
        res.json({msg:"ok",jwtkn});
        //return res.cookie('_jwtoken',jwtkn,{httpOnly:true});
    } catch (error) {
        // Atrapar error
        console.log(error);
        res.json({msg:"no-ok"});
        next();
    }
};

//Funcion para registrar nuevos clientes
const registro = async (req, res, next) => {
    //parsear datos
    const cliente = new Cliente(req.body);
    try {
        //validación
        await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
        await check('apellido').notEmpty().withMessage('El apellido no puede ir vacío').run(req);
        await check('email').isEmail().withMessage('Esto no parece un email').run(req);
        await check('pass').isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres').run(req);

        let resultdado = validationResult(req);

        // Verificar que no haya errores
        if (!resultdado.isEmpty()) {
            // Mostrar Errores
            return res.json(resultdado.array());
        }

        // Evitar usuarios duplicados
        const exists = await Cliente.findOne({ 'email': req.body.email })
        //console.log(exists);
        if (exists) {
            return res.json({ msg: "El email ya se encuentra registrado" })
        }

        // Almacenar registro si no hay erroe¿res
        cliente.token = generarId();

        // Enviar el email de confirmación
        emailResgistro({
            email: cliente.email,
            nombre: cliente.nombre,
            token: cliente.token
        });

        await cliente.save();

        return res.json({ msg: "Usuario Creado Correctamente, Revisa tu Email para Confirmar tu cuenta" });
    } catch (error) {
        // Atrapar error
        console.log(error);
        next();
    }

};

// Función para confirmar una cuenta
const confirmar = async (req, res, next) => {
    const { tkn } = req.params;

    try {
        const clienteConfirmar = await Cliente.findOne({token:tkn});
        clienteConfirmar.confirmado = true;
        clienteConfirmar.token = "";
        await clienteConfirmar.save();
        //console.log(clienteConfirmar);
        res.json({msg:"Usuario Confirmado Correctamente"});

    } catch (error) {
        const errors = new Error("Token no válido");
        return res.status(403).json({msg:errors.message});
        //console.log(errors.message);
    };
}

//Funcion para recuperar contraseña
const resetPasswd = async (req, res, next) => {
    const { email } = req.body;
    
    try {
        //validación email
        await check('email').isEmail().withMessage('Esto no parece un email').run(req);

        let resultdado = validationResult(req);

        // Verificar que no haya errores
        if (!resultdado.isEmpty()) {
            //Errores
            return res.json(resultdado.array());
        }

        // Buscar usuario
        const existsClient = await Cliente.findOne({ 'email': email })
        
        if (!existsClient) {
            return res.json({ msg: "No existe el usuario" })
        }


        // Generar token y enviar email
        existsClient.token = generarId();

        // Enviar el email de confirmación
        emailOlvidePassw({
            email: existsClient.email,
            nombre: existsClient.nombre,
            token: existsClient.token
        });

        await existsClient.save();

        return res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        // Atrapar error
        console.log(error);
        next();
    }
}


/**
 * Funcion para validar el token de cambio 
 * de contraseña.
 */
const comprobarToken = async (req,res) => {
    const {tkn} = req.params;
    const existCliente = await Cliente.findOne({token:tkn});
    if(existCliente){
        res.json({msg:"Usuario exitente && token válido"});
    } else {
        const error = new Error("Token no válido");
        res.status(404).json({msg:error.message});
    };
}

/**
 * Funcion para cambiar el password de 
 * un usuario
 */
const cambiarPass = async (req,res,next) => {
    const { tkn } = req.params;
    const { pass } = req.body;
    try {
        //validación
        await check('pass').isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres').run(req);

        let resultdado = validationResult(req);

        // Verificar que no haya errores
        if (!resultdado.isEmpty()) {
            // imprimir errores
            return res.json(resultdado.array());
        }

        // Ver que usuario va a realizar el cambio
        const existsClient = await Cliente.findOne({token:tkn});
        //console.log(exists);

        //nuevo pass
        existsClient.pass = pass;
        existsClient.token = '';
        await existsClient.save();

        return res.json({ msg: "Nueva contraseña guardada exitosamente" });
    } catch (error) {
        // Atrapar error
        console.log(error);
        res.json({msg:"Token no válido"});
        next();
    }
}

export {
    login,
    registro,
    confirmar,
    resetPasswd,
    comprobarToken,
    cambiarPass
}