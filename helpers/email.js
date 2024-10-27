// ## MAiltrap para testear envio de emails

import nodemailer from "nodemailer";

export const emailResgistro = async(datos) => {
    const { email, nombre, token } = datos;

    // configurar cliente para enviar email
    let transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Informacion del email
      const info = await transport.sendMail({
        from:'"SoundTain-Instruments - Venta de Instrumentos Musicales" <cuentas@soundtain.com>',
        to:email,
        subject:"SoundTain-Instruments - Confirma tu cuenta",
        text:"Confirma tu cuenta en SoundTain-Instruments",
        html: 
        `
        <p>Hola, ${nombre} confirma tu cuenta en SoundTain-Instruments</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: </p>
        <a href="${process.env.FRONTEND_URL}:${process.env.PORTF}/auth/confirmar/${token}" >Comprobar Cuenta</a>
        
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
      });

    //console.log(datos);
};

export const emailOlvidePassw = async(datos) => {
  const { email, nombre, token } = datos;
  
  // configurar cliente para enviar email
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

    // Informacion del email
    const info = await transport.sendMail({
      from:'"SoundTain-Instruments - Venta de Instrumentos Musicales" <cuentas@soundtain.com>',
      to:email,
      subject:"SoundTain-Instruments - Reestablecer Contraseña",
      text:"Reestablece tu contraseña",
      html: 
      `
      <p>Hola, ${nombre} has solicitado reestablecer tu contraseña</p>
      <p>Sigue el siguiente enlace para generar una nueva contraseña: </p>
      <a href="${process.env.FRONTEND_URL}:${process.env.PORTF}/auth/nueva-pass/${token}" >Reestablecer Contraseña</a>
      <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar este mensaje</p>
      `
    });

  //console.log(datos);
};

