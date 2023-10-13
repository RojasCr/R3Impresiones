const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");


class SendMail{

    static transporter = nodemailer.createTransport({
        service: "gmail",
        user: "smto.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "criscoder2023@gmail.com",
            pass: "bcffchezzhqutgai"
        }
    });
    
    static newUser = (receiver) => {
        const mailOptions = {
            from: "criscoder2023@gmail.com",
            to: receiver.email,
            subject: "Bienvenido",
            text: `¡Hola ${receiver.first_name}!
            Queremos darte la bienvenida a nuestra tienda.`
        };

        this.transporter.sendMail(mailOptions, (error, info) => {
            if(error) return console.log(error);
            console.log(`Mail enviado: ${info.response}`)
        })

    }

    static restorePass = (receiver) => {
    
        const token = jwt.sign({email: receiver}, "secretMail", {expiresIn: "1h"});
    
    
        let link = `https://dianshop.up.railway.app/restorePassword?token=${token}`;
        
        const mailOptions = {
            from: "criscoder2023@gmail.com",
            to: receiver,
            subject: "Restauración de passworrd",
            text: `Sigue el siguiente enlace vara restaurar tu password`,
            html: `<a href=${link}><input type="button" value="Click para recuperar contraseña"></a>`
        };
        
        this.transporter.sendMail(mailOptions, (error, info) => {
            if(error) return console.log(error);
            console.log(`Mail enviado: ${info.response}`)
        })
    }
    
    static inactiveUser = (receiver) => {
        const mailOptions = {
            from: "criscoder2023@gmail.com",
            to: receiver,
            subject: "Eliminación de cuenta",
            text: "Su cuenta fue desactivada por inactividad"
        };
        
        this.transporter.sendMail(mailOptions, (error, info) => {
            if(error) return console.log(error);
            console.log(`Mail enviado: ${info.response}`)
        })

    }

    static productDeleted = (receiver, product) => {
        const mailOptions = {
            from: "criscoder2023@gmail.com",
            to: receiver,
            subject: "Eliminación de producto",
            text: `Su producto ${product} fue eliminado de la tienda`
        };
        
        this.transporter.sendMail(mailOptions, (error, info) => {
            if(error) return console.log(error);
            console.log(`Mail enviado: ${info.response}`)
        })

    }
}

module.exports = SendMail;
