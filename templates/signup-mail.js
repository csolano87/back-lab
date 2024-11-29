"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();

this.enviar_mail = (pdf) => {
  const correo = "sistemas@distprolab.com";
  //const npdf = pdf;
  let transporter = nodemailer.createTransport({
    //"name": "www.office365.com",
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPSSWD,
    },
  });

  let mail_options = {
    from: '"SISTEMAS" <christian.solano@distprolab.com>',
    to: [correo],

    subject: `REPORTE`,
    attachments: [
      {
        filename: `reporte.pdf`, // the file name
        href: `${pdf}`, // link your file */
      },
    ],

    html: `
                    <table style="margin: 0 auto;
                    margin-left: 500px;
                    border-radius:10rem; 
                    border="0";        
                    cellspacing="3" ;
                    cellpadding="3";
                    width="25%";
                    height:100%;
                    bgcolor="#da8a1e">
                    <tr ">  
                     <td  style="height:80%;padding:30px;border-radius:2rem;">
                        <p style="padding:30px;
                        margin:30 auto; 
                        border-radius:2rem;                         
                        color:black; 
                        text-align:center; 
                        font-size:1.5rem">
                        Estimado (a)  <br> procedio con la recepcion de la guia.
                    <br>
                         </p> 
                        
                        <a  style="display:inline-block;
                        background-color:orange;
                        border-radius:25px; 
                    color:white;
                            margin:20px;
                        font-size: 20px;
                        text-decoration: none;
                   "        onMouseOver="this.style.cssText='color: #e5563f; display:inline-block;font-size: 20px;text-decoration: none;margin:10px;'" 
                            onMouseOut="this.style.cssText='color:white; display:inline-block;font-size: 20px;text-decoration: none;margin:10px;'"
                            href="http://104.209.211.243:4200/#/login" >Consulta de resultados</a>
                                                    <div style="display: block;
                                                    margin:70px;
                                                    background-color:orange;
                                                    text-align:center; 
                                                    font-size: 30px; 
                                                        padding: 5px; 
                                                        border-radius: 2rem;
                                                                target="_blank">
    
                                        </div>
                                                </td>
                                            </tr>

                                            <tr style=" margin-bottom:30px";bottom:0;
                                                bgcolor="#fff">
                                                <td style="text-align:center; 
                                                margin-bottom:30px">
                                        


                                                </td>


                                            </tr>

                                            </table>
                                        <br>
                                        <div style ="background-color:orange;margin:30px auto; width:100%; height:10%">
                                        <img src="../img/logo.png" >
                                        
                                            <p style ="text-align:center;font-size:1rem" >Nota de descarga: La información contenida es este e-mail es confidencial y solo puede ser utilizada por el individuo o la compania a las cuales esta dirigido</p>
                                        </div>
                                                
                                                
                                                `,
  };
  transporter.sendMail(mail_options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Correo se envió con éxito: " + info.response);
    }
  });
};
module.exports = this;
