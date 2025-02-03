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
const { header } = require("express-validator");


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

	const { id } = req.params;

	const imgPath = path.join(__dirname, "../public/Encabezado1.png");
	console.log(`----`, imgPath);
	const imgBase64 = fs.readFileSync(imgPath).toString("base64");
	console.log(`****`, imgBase64);

	const imgSrc = `data:image/png;base64,${imgBase64}`;

	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: {
			width: 750,
			height: 500,
			defaultViewport: 1,
			isMobile: true,
			hasTouch: false,
			isLandscape: false
		}

	});
	const page = await browser.newPage();

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

	const generateTableRows = () => {

		const groupedData = orden.prueba.reduce((acc, item) => {
			const nombreModelo = item?.panelprueba?.modelo?.NOMBRE || "Sin Modelo";

			if (!acc[nombreModelo]) {
				acc[nombreModelo] = [];
			}
			acc[nombreModelo].push(item);
			return acc;
		}, {});


		const dataOrden = Object.keys(groupedData).map((categoria) => ({
			categoria,
			pruebas: groupedData[categoria]
		}));


		const htmlRows = dataOrden
			.map((categoria) => {

				const categoriaRow = `
<tr class="page-break">
    <th class="title_categoria" colspan="4">${categoria.categoria}</th>
	
</tr>
`;

				const ValidacionRow = `
<tr>
   
	<td colpsan="3">Fecha Valildacion:</td>
<td>responsable:</td>
</tr>
`;


				const pruebasRows = categoria.pruebas
					.map((prueba) => {

						const nombre = prueba?.panelprueba?.NOMBRE || "Sin Nombre";
						const resultado = prueba?.resultado || "N/A";
						const rango = prueba?.panelprueba?.rango?.[0]?.rangos || "N/A";
						const unidad = prueba?.panelprueba?.rango?.[0]?.unidad?.DESCRIPCION || "N/A";
						const fechaValidacion = prueba?.fechaordenvalidada || "";

						return `
<tr class="avoid-break">
    <td>${nombre}</td>
    <td>${resultado}</td>
    <td>${rango}</td>
    <td>${unidad}</td>
	
</tr>
`;
					})
					.join("");

				return categoriaRow + pruebasRows + ValidacionRow;
			})
			.join("");

		return htmlRows;
	};
	const headerHeight = '120px';
	const htmlContent = `
<html>

<head>
    <style>
	
        body {
            font-family: Georgia, 'Times New Roman', Times, serif;
            padding-top: 180px;


            font-size: 1rem;

        }

        table {

            width: 100%;
            margin: 0px auto;
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
background-color: #e6e6de;
            font-size: 0.6rem;
            font-weight: bold;
            text-align: center;
        }

        td {
            font-size: 0.5rem;
        }
			.title_categoria{

			background-color: #cacac6;
		
			}


    </style>
</head>

<body>
    <div>
        <table>
            <thead>

                <tr>
                    <th>Nombre</th>
                    <th>Resultado</th>
                    <th>Rango</th>
                    <th>Unidad</th>
                </tr>
            </thead>
            <tbody>
                ${generateTableRows()} <!-- Aquí insertamos las filas dinámicamente -->
            </tbody>
        </table>
</body>

</html>
</div>`;



	await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
	await page.emulateMediaType("screen");
	await page.pdf({

		path: 'reporte.pdf',
		format: 'A4',

		displayHeaderFooter: true,
		margin: { top: '180px', bottom: '60px' },
		printBackground: true,
		margin: { top: '2cm', right: '0.5cm', bottom: '2cm', left: '0.5cm' },
		headerTemplate: `

<style>

    .datos_paciente {
	background-color: #e6e6de;
        width: 100%;
        /* Ajusta el ancho del contenedor */
		padding:20px 15px;
        margin: 0 auto;
        /* Centra el contenedor horizontalmente */
        overflow: hidden;
        /* Limpia los floats */
        display: flex;
        /* Flexbox para ayudar con el centrado */
       
        /* Centra las columnas */
        gap: 20px;
        /* Espaciado entre columnas */
    }

    .columna {
     float:left;
        /* Opcional si quieres compatibilidad antigua */
     
        /* Define el ancho de las columnas */
        margin: 0px auto;
        text-align: left;
        /* Centra el contenido dentro de la columna */
    }

    .columna p {


        margin: 0px auto;
    }

    p {
	font-size:14px;
	padding:0.5px;}
</style>
<div style="width:100%;  text-align:center; font-size:10px;">
    <img src="${imgSrc}" style="width: 100%; height: auto;" />  




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
</div>

`,
		footerTemplate: `<div style="font-size:10px; text-align:center; width:100%;">
		 <img src="${imgSrc}" style="width: 100%; height: auto;" />  
		Página <span class="pageNumber"></span> de
    <span class="totalPages"></span>
</div>`,
		margin: { top: '60px', bottom: '60px' }
	});
	await browser.close();
	console.log('PDF generado con éxito: reporte.pdf')
};

module.exports = {
	getpdf,
	getIngresOrdenPdf,
};
