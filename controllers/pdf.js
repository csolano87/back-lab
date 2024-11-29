const { PDFDocument, rgb, hasUtf16BOM, utf16Decode } = require("pdf-lib");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { Request, Response } = require("express");
const Cabecera = require("../models/cabecera");
const pdf = require("html-pdf");
const path = require("path");
const Handlebars = require("handlebars");
const Detalle = require("../models/detalle");
const Cabecera_Agen = require("../models/cabecera_agen");
const Detalle_Agen = require("../models/detalle_agen");
const Orden = require("../models/ordenes");
const Prueba = require("../models/pruebas");
const Panel_pruebas = require("../models/panelPruebas");
const Rango = require("../models/rangosreferencia");
const Paciente = require("../models/paciente");
const Medico = require("../models/medico");

const Tiposervicio = require("../models/tiposervicio");
const Modelo = require("../models/modelo");
const Tipoatencion = require("../models/Tipoatencion");
const Unidad = require("../models/unidad");

const getpdf = async (req, res) => {
	const { id } = req.params;

	console.log(id);
	const idCabecera = await Cabecera_Agen.findOne({
		where: { id: id },
		include: {
			model: Detalle_Agen,
			as: "as400",
			attributes: ["ItemID", "ItemName"],
		},
	});

	if (!idCabecera) {
		return res.status(400).json({ msg: "No existe orden creada" });
	}
	const opcionesPDF = {
		format: "Letter",
		border: {
			top: "1px",
			right: "1px",
			bottom: "1px",
			left: "1px",
		},
	};

	let html = '<table style="border-collapse: collapse;">';

	html += "<thead><tr>";
	html +=
		' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">INSTITUCION DEL SISTEMA</th>';
	html +=
		' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">UNIDAD OPERATIVA</th>';
	html +=
		' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">COD. UO</th>';
	html +=
		' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">COD. LOCALIZACION</th>';
	html +=
		' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">NUMERO DE  HISTORIA CLINICA</th>';

	html += "</tr></thead>";

	html += "<tbody><tr>";
	html +=
		'<td style="border: 1px solid black;font-size:28px">Ministerio de Salud publica</td>';
	html += '    <td style="border: 1px solid black;font-size:28px">HGMI</td>';
	html += '    <td style="border: 1px solid black;font-size:28px">12-032</td>';
	html +=
		'    <td style="border: 1px solid black;font-size:28px">01-12-12</td>';
	html += `    <td style="border: 1px solid black;font-size:28px">${idCabecera.IDENTIFICADOR}</td>`;
	html += "</tr></tbody>";

	html += "<thead><tr>";
	html +=
		'<th style="border: 1px solid black;font-size:18px;width:30%;background-color: #8f8888;">ORIGEN</th>';
	html +=
		'        <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">SERVICIO</th>';
	html +=
		'        <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">SALA</th>';
	html +=
		'        <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">CAMA</th>';
	html +=
		'        <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">FECHA TOMA</th>';

	html += "</tr></thead>";

	html += "<tbody><tr>";
	html +=
		'   <td style="border: 1px solid black;font-size:28px;">CONSULTA EXTERNA</td>';
	html += '   <td style="border: 1px solid black;font-size:28px"></td>';
	html += '   <td style="border: 1px solid black;font-size:28px"></td>';
	html += '   <td style="border: 1px solid black;font-size:28px"></td>';
	html += `  <td style="border: 1px solid black;font-size:28px">${idCabecera.FECHATOMA}</td>`;
	html += "</tr></tbody>";

	html += "<thead><tr>";
	html +=
		'<th style="border: 1px solid black;font-size:18px;width:60%;background-color: #8f8888;">APELLIDOS</th>';
	html +=
		'       <th style="border: 1px solid black;font-size:18px;width:60%;background-color: #8f8888;">NOMBRES</th>';
	html +=
		'       <th style="border: 1px solid black;font-size:18px;width:40%;background-color: #8f8888;">EDAD</th>';
	html +=
		'       <th style="border: 1px solid black;font-size:18px;width:60%;background-color: #8f8888;">CEDULA</th>';
	html +=
		'       <th style="border: 1px solid black;font-size:18px;width:60%;background-color: #8f8888;">HIS</th>';

	html += "</tr></thead><br>";

	html += "<tbody><tr>";
	html += `   <td style="border: 1px solid black;font-size:20px;">${idCabecera.APELLIDO}</td>`;
	html += `    <td style="border: 1px solid black;font-size:20px;">${idCabecera.NOMBRES}</td>`;
	html += `    <td style="border: 1px solid black;font-size:20px;">${idCabecera.EDAD}</td>`;
	html += `  <td style="border: 1px solid black;font-size:20px;">${idCabecera.IDENTIFICADOR}</td>`;
	html += `  <td style="border: 1px solid black;font-size:20px;">${idCabecera.HIS}</td>`;
	html += "</tr></tbody>";

	// Agregar encabezado de la tabla
	html += "<thead><tr>";
	html +=
		'<th style="border: 1px solid black;font-size:28px;width:100%;background-color: #8f8888;" colspan="5""> Lista de examenes </th>';

	html += "</tr></thead>";

	// Agregar contenido de la tabla
	html += "<tbody>";
	idCabecera.as400.forEach((dataValue) => {
		html += "<tr>";
		html += `<td style="border: 1px solid black;font-size:28px;width:100%;" colspan="5"">${dataValue.ItemID} ${dataValue.ItemName}</td>`;

		html += "</tr>";
	});
	html += "</tbody>";

	// Cerrar la etiqueta de la tabla

	html += "<thead><tr>";
	html +=
		' <th style="border: 1px solid black;background-color: #8f8888;">FECHA</t>';
	html += `<td style="height:50%">${idCabecera.FECHAORDEN}</td>`;
	html +=
		' <th style="border: 1px solid black;background-color: #8f8888;">HORA</t>';
	html += `<td style="height:50%">${idCabecera.HORAORDEN}</td>`;

	html += "</tr></thead><br>";

	html += "<tbody><tr>";

	html +=
		'<th style="border: 1px solid black;background-color: #8f8888;">NOMBRE DEL PROFESIONAL</t>';
	html += `<td>${idCabecera.CODDOCTOR}</td>`;
	html +=
		'<th style="border: 1px solid black;background-color: #8f8888;">FIRMA</t>';
	html += `<td>${idCabecera.CODDOCTOR}</td>`;
	html += "</tr></tbody>";

	html += "</table>";

	pdf.create(html, opcionesPDF).toStream((err, stream) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Error al generar el archivo PDF" });
		}

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", 'attachment; filename="archivo.pdf"');

		stream.pipe(res);
	});
};

const getIngresOrdenPdf = async (req, res) => {
	try {
		const imgPath = path.join(__dirname, "../public/Encabezado1.png");
		console.log(`----`, imgPath);
		const imgBase64 = fs.readFileSync(imgPath).toString("base64");
		console.log(`****`, imgBase64);

		const imgSrc = `data:image/png;base64,${imgBase64}`;
		console.log(`++++`, imgSrc);
		const { id } = req.params;

		const orden = await Orden.findByPk(id, {
			include: [
				{
					model: Prueba,
					as: "prueba",
					include: {
						model: Panel_pruebas,
						as: "panelprueba",
						include: [
							{
								model: Rango,
								as: "rango",
								include: {
									model: Unidad,
									as: "unidad",
								},
							},

							{
								model: Modelo,
								as: "modelo",
							},
						],
					},
				},
				{
					model: Paciente,
					as: "paciente",
				},
				{
					model: Medico,
					as: "medico",
				},
				{
					model: Tipoatencion,
					as: "tipoatencion",
				},
				{
					model: Tiposervicio,
					as: "tiposervicio",
				},
			],
		});

		if (!orden) {
			return res.status(404).json({ error: "Orden no encontrada" });
		}
		const { prueba } = orden;
		const result = prueba.reduce((acc, item) => {
			//	console.log(item.dataValues.panelprueba.dataValues);
			const nombreModelo =
				item.dataValues.panelprueba.dataValues.modelo.dataValues.NOMBRE;
			if (!acc[nombreModelo]) {
				acc[nombreModelo] = { pruebas: [] };
			}
			acc[nombreModelo].pruebas.push(item);
			return acc;
		}, {});

		const dataorden = Object.keys(result).map((item) => {
			return {
				categoria: item,
				pruebas: result[item],
			};
		});

		const htmlRows = dataorden
			.map((categoria) => {
				const categoriaRow = `<tr class="page-break">
     <th class="title_categoria  " colspan="4">${categoria.categoria}</th>
</tr>
`;

				const pruebasRows = categoria.pruebas.pruebas
					.map((prueba) => {
						console.log(
							`++RANGOS`,
							prueba.panelprueba?.rango[0]?.unidad.DESCRIPCION
						);
						return `

<tr>
     <td>${prueba.panelprueba.NOMBRE}</td>
     <td>${prueba.resultado}</td>
     <td>${prueba.panelprueba?.rango[0]?.rangos}</td>
     <td>${prueba.panelprueba?.rango[0]?.unidad.DESCRIPCION}</td>
</tr>
`;
					})
					.join("");

				// Combinar la fila de la categoría con sus filas de pruebas
				return categoriaRow + pruebasRows;
			})
			.join("");
		
	const  htmlHeaders=  `
<!Doctype html>
<html>

<head>
     <meta charset="utf-8">
     <title>PDF Result Template</title>
     <style>

	      *{
	  
	        }
          body {
               font-family: Georgia, 'Times New Roman', Times, serif;
 margin:0 auto;
              
			  
               font-size: 1rem;

          }

          .title_categoria {
               text-align: center;
               margin: 0px auto;
               padding: 15px;
          }

          h1 {
               text-align: center;

          }




.datos_paciente {
  width: 100%; /* Ajusta el ancho del contenedor */
  margin: 10px auto; /* Centra el contenedor horizontalmente */
  overflow: hidden; /* Limpia los floats */
  display: flex; /* Flexbox para ayudar con el centrado */
  justify-content: center; /* Centra las columnas */
  gap: 20px; /* Espaciado entre columnas */
}

.columna {
  float: left; /* Opcional si quieres compatibilidad antigua */
  width: 50%; /* Define el ancho de las columnas */
  margin:10px auto;
  text-align: left; /* Centra el contenido dentro de la columna */
}

          .columna p {

               margin: 10px ;
          }

          table {

               width: 100%;
               margin: 10px auto;
               border-top: 1px solid black;
               border-collapse: collapse;
          }

          th,
          td {
               border-bottom: 1px solid #ddd;
               text-align: center;
               padding: 10px;
          }

          th {

               font-size: 14px;
               font-weight: bold;
               text-align: center;
          }

          td {
               font-size: 12px;
          }

          .prevent-break {
               page-break-inside: avoid;

               /* Ajusta el margen para asegurar que haya espacio suficiente */
          }

     #pageHeader {
  position: fixed;
  top: -15px; /* Coloca el encabezado al borde superior */
  left: 0;
  width: 100%;
   /* Ajusta la altura del encabezado */
  background: white; /* Asegura un fondo blanco si hay contenido debajo */
  text-align: center;
  z-index: 999; /* Asegura que esté por encima del resto del contenido */
}

#pageHeader img {
  width: 100%; /* Escala la imagen para que no exceda el ancho */
  height: auto; /* Mantiene la proporción de la imagen */
}
           
             

          .page-break {
               page-break-before: always;
          }
     </style>



</head>

<body>

<div id='pageHeader'>
<img src='${imgSrc}'  />

</div>






     <div class="datos_paciente">
          <div class="columna">
               <p><strong>Nº Identificación:</strong> ${orden.paciente.numero}</p>
               <p><strong>Paciente:</strong> ${orden.paciente.apellidos} ${orden.paciente.nombres}</p>
               <p><strong>Edad:</strong> ${orden.paciente.edad} Años &nbsp;
                    &nbsp;<strong>Sexo:</strong>${orden.paciente.sexo}</p>

               <p><strong>Fecha de Ingreso:</strong> ${orden.fechaorden} ${orden.horaorden}</p>
          </div>
          <div class="columna">
               <p><strong>Nº de Petición:</strong> ${orden.numeroorden}</p>
               <p><strong>Nº Procedencia:</strong> ${orden.tiposervicio.nombre} </p>
               <p><strong>Servicio:</strong> ${orden.tipoatencion.nombre}</p>

               <p><strong>Médico:</strong> ${orden.medico.apellidos} ${orden.medico.nombres}</p>
          </div>



     </div>



     <div>
          <table>
               <thead>
                    <tr>

                         <th>EXAMEN</th>
                         <th>RESULTADO</th>
                         <th>UNIDAD</th>
                         <th>RANGO REFERENCIA</th>

                    </tr>
               </thead>
               <tbody>
                    ${htmlRows}

               </tbody>
          </table>
     </div>
     <div id="pageFooter" style="border-top: 1px solid #ddd; ">
          <p
               style="color: #666; width: 70%; margin: 0; padding-bottom: 5px; text-align: let; font-family: sans-serif; font-size: .65em; float: left;">
          <p>Generado por: </p>
          </h4>
          <p
               style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">
               Página {{ page }} de {{ pages }}</h4>
     </div>

</body>
</div>

</html> `;

		const opcionesPDF = {
			format: "A4",
			orientation: "portrait", // 'landscape' o 'portrait'
			border: {
				top: "2cm1mm", // Ajusta esto según sea necesario
				right: "10mm",
				bottom: "10mm",
				left: "10mm",
			},

			
			footer: {
				height: "5cm", // Altura del pie de página
				contents: {
					default: `
		  <div style="text-align: center; font-size: 10px;">
			Página {{page}} de {{pages}}
			
		  </div>
		`,
				},
			},
		};

		pdf.create(htmlHeaders, opcionesPDF).toStream((err, stream) => {
			if (err) {
				console.error(err);
				return res
					.status(500)
					.json({ error: "Error al generar el archivo PDF" });
			}

			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				'attachment; filename="ReporteStock.pdf"'
			);

			stream.pipe(res);
		});
	} catch (error) {
		console.error("Error generando PDF:", error);
		res.status(500).json({ error: "Error al generar el PDF" });
	}
};

module.exports = {
	getpdf,
	getIngresOrdenPdf,
};
