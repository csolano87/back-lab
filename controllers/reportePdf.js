const { PDFDocument, rgb, hasUtf16BOM, utf16Decode } = require("pdf-lib");
const fs = require("fs");

const { Request, Response } = require("express");

const pdf = require("html-pdf");

const Proceso = require("../models/proceso");

const Reportepdf = async (req, res) => {
	const { id } = req.params;

	console.log(id);
	const idProceso = await Proceso.findOne({
		where: { id: id },
	});

	if (!idProceso) {
		return res.status(400).json({ msg: "No existe orden creada" });
	}

	function createTableRow(equipo, principal, valor, backup, valorBackup) {
		return `
    <tr >
    <td>${equipo}</td>
        <td>${principal}</td>
        <td>${valor}</td>
        <td>${backup}</td>
        <td>${valorBackup}</td>
    </tr>
    `;
	}
	const modeloPDF = `
<!Doctype html>
<html>
    <head>
        <meta charset="utf-8">
            <title>PDF Result Template</title>
            <style>
                body {
                    font-family: Georgia,'Times New Roman', Times, serif;
                    margin: 20px  50px;
                    font-size: 0.7rem;
      
                      }

                h1{
                    text-align: center;
       
                      }
                p{
                    margin:5px 70px;
                   }

                .fila1{
                    padding:20px;
                    margin:0 auto;
                    margin-left:20px
                     }


                     .fila {
                        display: flex;
                        justify-content: space-between; 
                        align-items: center;
                    }
                    
                    .fila > div {
                        flex: 1; 
                        margin: 0 10px; 
                    }

                .fila2{
                    display:inline-block;
                    padding:20px;
                    margin-left:30px;

                        }

                .text_fila{
                    margin-left:60px;
                        }

                table {
                    border-collapse: collapse;
                    width: 90%;
                    margin:0 auto;
                    border: 1px solid #dddddd;
                        }

                th, td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 5px;
                        }

                th {
                    background-color: #f2f2f2;
                    font-size: 12px;
                    font-weight: bold;
                        }

                td {
                    font-size: 11px;
                        }

                .li_text{
                    list-style: none;
                    padding:10px;
                    margin 7px auto;

                        }
                        .fila_areas {
                            column-count: 2; /* Establece dos columnas */
                            column-gap: 20px; /* Espacio entre las columnas */
                            margin-bottom: 80px; /* Espacio adicional al final */
                        }
                
                     
                .equipo_text{
                    display: flex-box;
                    flex-wrap:no-wrap;
                     justify-content: space-between;
                        }

                        .page-break {
                            page-break-before: always;
                        }
            </style>



    </head>
    <body>
       <script>
        function addPageBreaks() {
            const footerHeight = document.getElementById('pageFooter').offsetHeight;
            const listItems = document.querySelectorAll('ul');
            
            listItems.forEach((list) => {
                const rect = list.getBoundingClientRect();
                const listBottom = rect.bottom;
                const pageHeight = window.innerHeight;

                // Check if the list is close to the footer
                if (listBottom > (pageHeight - footerHeight)) {
                    list.classList.add('page-break');
                }
            });
        }

        document.addEventListener('DOMContentLoaded', addPageBreaks);
    </script>
        <div id="pageHeader" style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">
        <img src="/Encabezado1.png" alt="" />
        </div>
        <div id="pageFooter" style="border-top: 1px solid #ddd; padding-top: 5px;">
            <p style="color: #666; width: 70%; margin: 0; padding-bottom: 5px; text-align: let; font-family: sans-serif; font-size: .65em; float: left;"><p>Generado por: ${
							idProceso.usuarioId
						}</p></h4>
            <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">Página {{ page }} de {{ pages }}</h4>
        </div>

        <h1> Reporte de Proceso</h1>
       

<div class="fila">
<div>
    <h4>Institución:</h4>
    <p>${idProceso.institucion}</p>
</div>
<div>
    <h4>Código:</h4>
    <p>${idProceso.codigo}</p>
</div>
</div>

        <div class="fila">
            <h4 >Link proceso: </h4>
            <p>${idProceso.linkproceso}</p>

        </div>
        <div class="fila">
            <h4 >Tiempo consumo:</h4>
            <p>${idProceso.tiempoconsumo}</p>
            <h4 >Determinacion : </h4>
            <p>${idProceso.determinacion}</p>

        </div>
        <div class="fila">
            <h4 >Prepuesto: </h4>
            <p>${idProceso.presupuesto}</p>
            <h4 >Entrega de carpeta: </h4>
            <p>${idProceso.entregacarpeta}</p>
        </div>


        <div class="fila_areas">
            <h4>Areas</h4>
            <ul>
                ${idProceso.areas
									.map(function (area) {
										return `<li class="li_text">${area.areas}</li>`;
									})
									.join("")}
            </ul>
        </div>
         <div class="page-break">
        <table>
            <thead>
                <tr>
                <th>Equipo</th>
                    <th>Principal</th>
                    <th>Valor </th>
                    <th>Backup</th>
                    <th>Valor </th>
                </tr>
            </thead>
            <tbody>
            ${Object.keys(idProceso.equipoprincipal)
							.map((key) => {
								if (key.startsWith("eq")) {
									const principal = idProceso.equipoprincipal[key];

									const valorKey = `val${key.slice(2)}`;

									const valor = idProceso.equipoprincipal[valorKey];

									const equipo = `${valorKey}`.replace("val", "").toUpperCase();

									const backupKey = `bk${key.slice(2)}`;

									const backup = idProceso.equipobackup[backupKey];

									const valorBackupKey = `valbk${backupKey.slice(2)}`;
									const valorBackup = idProceso.equipobackup[valorBackupKey];
									return createTableRow(
										equipo,
										principal,
										valor,
										`${backup}`.replace("undefined", ""),
										`${valorBackup}`.replace("undefined", "")
									);
								}
							})
							.join("")}
        </tbody>
        </table>
        </div>
        <h4 class="fila"> Tercera opinion : </h4>
        <p>${idProceso.terceraopcion}</P>
        <h4 class="fila">Sistema elegido : </h4>
        <P>${idProceso.sistema}</P>

        <h4 class="fila">Licencia de equipo hematologico:</h4>
        <ul>
            ${idProceso.licenciaEquiposHematologicos
							.map(function (obs) {
								return `<li class="li_text">${obs.valorinput}</li>`;
							})
							.join("")}
        </ul>
        <h4 class="fila"> Observacion: </h4>
        <p>${idProceso.observacion}</P>
        
    </body>
</html>
 `;

	const opcionesPDF = {
		format: "Letter",
		orientation: "portrait",
		border: {
			top: "1px", // default is 0, units: mm, cm, in, px
			right: "3px",
			bottom: "2px",
			left: "3px",
		},
	};

	/* pdf.create(modeloPDF, opcionesPDF).toBuffer((err, buffer) => {
    const maillist = correo2.split(";");
    let transporter;
    if (user.usuario == "stefani.rivas@distprolab.com") {
        transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            requireTLS: true,

            auth: {
                user: "stefani.rivas@distprolab.com",
                pass: "D1stprol@B2021",
            },
        });
    } else {
        transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            requireTLS: true,

            auth: {
                user: "christian.solano@distprolab.com",
                pass: "D1stprol@2021",
            },
        });
    }
    const obtenerCodigo = codigo.split("-");
    console.log(`obtener codigo`, obtenerCodigo);
    let mail_options = {
        from: '"SISTEMAS" <christian.solano@distprolab.com>',
        to: maillist,

        subject:
            obtenerCodigo[0] === "SIE"
                ? `RENTABILIDAD - ${institucion} - ${codigo}`
                : obtenerCodigo[0] === "NIC"
                ? `INFIMA CUANTIA - ${institucion} - ${codigo}`
                : `NECESIDAD DE CONTRATACION - ${institucion} - ${codigo}`,
        attachments:

          
            {
                filename: "reporte.pdf",
                content: buffer,
            },
        
    };
    transporter.sendMail(mail_options, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            // console.log("Correo se envió con éxito: " + info.response);
            res.status(201).json({
                ok: true,
                msg: `Se ha registrado con exito ${codigo}`,
            });
        }
    });
}); */

	pdf.create(modeloPDF, opcionesPDF).toStream((err, stream) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Error al generar el archivo PDF" });
		}

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", 'attachment; filename="archivo.pdf"');

		stream.pipe(res);
	});
};

module.exports = {
	Reportepdf,
};
