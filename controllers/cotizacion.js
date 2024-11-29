const { Request, Response } = require("express");
const { PDFDocument, rgb, hasUtf16BOM, utf16Decode } = require("pdf-lib");
var moment = require("moment");
const pdf = require("html-pdf");
const Roles = require("../models/role");
const { Op, where, Model } = require("sequelize");
const Contrato = require("../models/contrato");
const validator = require("ecuador-validator");
const fs = require("fs");
const path = require("path");
const Cotizacion = require("../models/cotizacion");
const Itemcotizacion = require("../models/itemcotizacion");
const { sequelize } = require("../models/cotizacion");
const Equipos = require("../models/equipos");
const Modalidad = require("../models/modalidad");
const Analizador = require("../models/analizador");
const Modelo = require("../models/modelo");
const consultaCotizacion = async (req, res) => {
	const cotizacion = await Cotizacion.findAll({
		include: [
			{
				model: Modalidad,
				as: "modalidad",
			},
			{
				model: Itemcotizacion,
				as: "itemcotizacion",
				include: {
					model: Analizador,
					as: "instrumento",
					include: {
						model: Modelo,
						as: "modelo",
					},
				},
			},
		],
	});

	res.json({ ok: true, cotizacion });
};

const GetIDCotizacion = async (req, res) => {
	res.json({ usuarios });
};

const postCotizacion = async (req, res) => {
	const file = req.file;
	const filePath = `uploads/${file.filename}`;
	console.log(`filePath------->`, filePath);
	//console.log(`data==>`, req.body);
	const parsedData = {
		RAZONSOCIAL: JSON.parse(req.body.RAZONSOCIAL),
		RUC: JSON.parse(req.body.RUC),
		CORREO: JSON.parse(req.body.CORREO),
		MODALIDAD: JSON.parse(req.body.MODALIDAD),
		ESTADISTICA: JSON.parse(req.body.ESTADISTICA),
		COMENTARIOS: JSON.parse(req.body.COMENTARIOS),
		EQUIPO_ID: JSON.parse(req.body.EQUIPO_ID),
	};

	console.log(parsedData);
	const {
		RAZONSOCIAL,
		RUC,
		CORREO,
		MODALIDAD,
		EQUIPO_ID,
		ESTADISTICA,
		//CARGA,
		COMENTARIOS,
	} = parsedData;

	const existecotizacion = await Cotizacion.findOne({
		where: { RUC: RUC },
	});
	console.log(existecotizacion);

	if (existecotizacion) {
		return res
			.status(200)
			.json({ ok: false, msg: `La cotizacion ${RUC} ya existe` });
	}

	await sequelize.transaction(async (t) => {
		const nuevacotizacion = await Cotizacion.create(
			{
				RAZONSOCIAL,
				RUC,
				CORREO,
				modalidadId: MODALIDAD,

				ESTADISTICA,
				CARGA: filePath,
				COMENTARIOS,
			},
			{ transaction: t }
		);

		const itemcotizacion = await Itemcotizacion.create(EQUIPO_ID, {
			transaction: t,
		});
		await nuevacotizacion.setItemcotizacion(itemcotizacion, { transaction: t });
		res.status(201).json({
			msg: `La cotizacion con  razon social ${RAZONSOCIAL} a sido registrado con exito`,
		});
	});
};

const UpdateCotizacion = async (req, res) => {
	res.send("update guardada con exito..");
};

const DeleteCotizacion = async (req, res) => {
	const id = req.params.id;
	const { NOMBRE } = req.body;
	const contrato = await Contrato.findByPk(id);
	if (!contrato) {
		return res.status(404).json({
			msg: "El contrato  no existe...",
		});
	}
	await contrato.update({
		ESTADO: 0,
	});

	res.status(200).json({
		msg: `El nombre ${NOMBRE} a sido desactivado con exito...`,
	});
};

const ReporteCotizacion = async (req, res) => {
	const { reporte } = req.params;
	const date = moment().zone("-05:00").format("LL");
	/* const imgPath = 'https://placehold.co/300x200';

    // Leer la imagen y convertirla a base64
    const imgBase64 = fs.readFileSync(imgPath).toString('base64');

    // Definir el src como un Data URL
    const imgSrc = `data:image/png;base64,${imgBase64}`; */
	console.log(reporte);
	const cotizacion = await Cotizacion.findOne({
		where: { id: reporte },
		include: [
			{
				model: Modalidad,
				as: "modalidad",
			},
			{
				model: Itemcotizacion,
				as: "itemcotizacion",
				include: {
					model: Analizador,
					as: "instrumento",
				},
			},
		],
	});

	if (!cotizacion) {
		return res.status(400).json({ msg: "No existe cotizacion creada" });
	}

	const imgPath = path.join(__dirname, "../public/Encabezado1.png");
	const imgPathfooter = path.join(__dirname, "../public/Pie de Pagina.png");
	// Leer la imagen y convertirla a base64
	const imgBase64 = fs.readFileSync(imgPath).toString("base64");
	const imgBase64footer = fs.readFileSync(imgPathfooter).toString("base64");
	// Definir el src como un Data URL
	const imgSrc = `data:image/png;base64,${imgBase64}`;
	const imgSrcfooter = `data:image/png;base64,${imgBase64footer}`;
	function createTableRow(ITEMS, DESCRIPCION, CANTIDAD, PRECIOUNITARIO, TOTAL) {
		return `
		<tr >
		<td>${ITEMS}</td>
			<td>${DESCRIPCION}</td>
			<td>${CANTIDAD}</td>
			<td>${PRECIOUNITARIO}</td>
			<td>${TOTAL}</td>
		</tr>
		`;
	}
	const modeloPDF = `<!Doctype html>
<html>

<head>
	<meta charset="utf-8">
	<title>PDF Result Template</title>
	<style>
		body {
			font-family: Georgia, 'Times New Roman', Times, serif;
			margin: 0 ;
			padding: 0;
			
		}

		.container {
            width: 100%; /* Ajustar el ancho del contenido */
            margin: 0 auto; /* Márgenes automáticos para centrar */
            padding: 0; /* Eliminar padding dentro del contenedor */
            background-color: #fff;
        }

        #pageHeader {
            padding: 0; /* Eliminar padding */
            margin: 0;  /* Eliminar margen */
			margin-top:-40px;
			
            text-align: center;
        }
			#pageFooter{
			  padding: 0; /* Eliminar padding */
            margin: 0;  /* Eliminar margen */
			margin-bottom:-80px;
			}
		h3 {
            margin: 5px 0; /* Reducir márgenes */
			
        }
			.text_oferta{
			text-align: left;
			}
      p{
	  margin:10px;
	  text-align: justify;
  text-justify: inter-word;

	  font-size: 16px;
			
	  }
	  .fila{
	  margin:10px;
	  }
		.fila_text2 {
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			flex-direction: column;
			height: 100%;
		}
			.text_lista{
			margin:10px;
			margin-bottom:-50px;
			padding:10px;
			}

		table {
			border-collapse: collapse;
			width: 100%;
			margin: 20px 0;
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

		/* .figure_img img {
			max-width: 100%;
			height: auto;
		} */
		.figure_img  {
			text-align: center;
		}

		.li_text {
			list-style-type: square;
			font-size: 13px;
			margin-top:10px;
			margin-bottom: 5px;
		}
			 .prevent-break {
    page-break-inside: avoid;
    margin-bottom: 20px; /* Ajusta el margen para asegurar que haya espacio suficiente */
}

						

	</style>
</head>

<body>
	<div class="container">
		<div id="pageHeader" ">
		 <img src='${imgSrc}'style="width: 100%; height: auto;" />
		</div>
		<div id="pageFooter" ">
			<img src='${imgSrcfooter}' style="width: 100%; height: auto;">
		</div>

		<div class="fila">
			<h3>CLIENTE: ${cotizacion.RAZONSOCIAL}</h3>
			<h3>RUC: ${cotizacion.RUC}</h3>
			<h3>CORREO: ${cotizacion.CORREO}</h3>
		</div>

		<div class="fila_text2">
			<h3>PROFORMA# 00000000</h3>
			<h3>${cotizacion.modalidad.NOMBRE}</h3>
			<h3>EQUIPO OFERTADO</h3>
		</div>

		<div class="text_lista">
			${cotizacion.itemcotizacion
				.map(function (item) {
					return `<h3 style="font-size: 16px;"> ${item.instrumento.NOMBRE}</h3>
				<figure class="figure_img">
					<img src='https://placehold.co/300x200'>
				</figure>
				<ul>
					${item.instrumento.CARACTERISTICA.split("\n")
						.filter((linea) => linea.trim() !== "")
						.map(function (linea) {
							return `<li class="li_text">${linea}</li>`;
						})
						.join("")}
				</ul>`;
				})
				.join("")}

            <div class="fila_text2 prevent-break">
			<div><h3>LA OFERTA BAJO LA MODALIDAD ${
				cotizacion.modalidad.NOMBRE
			} DEL EQUIPO INCLUYE:</h3></div>
			<div>
			<h4 class="text_oferta">1. CAPACITACION:</h4>
			<p>
			Sobre el manejo  del Equipo: F880 marca: MACCURA, el cual tendra duración de 3 horas in situ.
			</p>
			<h4 class="text_oferta">2. SERVICIO TÉCNICO:</h4>
			<p> <strong>
			MANTENIMIENTO PREVENTIVO:</strong> se realizará de acuerdo a un cronograma establecido de común acuerdo con el cliente y con las recomendaciones del fabricante e incluirá al menos 2 visitas programadas por año.</p>
			<p><strong>MANTENIMIENTO CORRECTIVO:</strong>
			 soporte técnico estará disponible en horario laboral durante todo el tiempo de vigencia de la garantía y el tiempo de respuesta para la primera atención no será mayor a 72 horas. Contamos con servico técnico REMOTO y telefónico las 24/7 para realizar operaciones online y dar solucion inmediata.
			</p>
			



			</div>
			</div>

 
			 
			 <div class="fila_text2">
			
			<h3>PROPUESTA ECONOMICA</h3>
			<h3>EQUIPO </h3>
		</div>
        <table>
		
            <thead>
                <tr>
                <th>ITEMS</th>
                    <th>DESCRIPCION</th>
                    <th>CANTIDAD </th>
                    <th>PRECIO UNITARIO</th>
                    <th>VALOR TOTAL </th>
                </tr>
            </thead>
            <tbody>
           ${cotizacion.itemcotizacion
							.map((key) => {
								return createTableRow(
									key.id,
									`${
										cotizacion.modalidad.NOMBRE +
										" DE EQUIPO " +
										key.instrumento.NOMBRE
									}`,
									key.CANTIDAD
								);
							})
							.join("")}
        </tbody>
		<tfoot>
    <tr>
        <th rowspan="3" colspan="3" style="text-align: left;">
		<strong>SON:  00/100 DOLARES AMERICANOS</strong>
		</th>
        <td class="totals">Subtotal</td>
        <td>$${1000}</td>
    </tr>
    <tr>
      
        <td class="totals">IVA (${cotizacion.ivaPorcentaje}%)</td>
        <td>$${15}</td>
    </tr>
    <tr>
       
        <td class="totals">Total</td>
        <td>$${60000}</td>
    </tr>
</tfoot>
        </table>
        </div>
		</div>
	</div>


	
</body>

</html>


	 `;

	const opcionesPDF = {
		format: "Letter",
		orientation: "portrait",
		border: {
			top: "0in", // Eliminación de margen superior
			right: "0.5in",
			bottom: "0in", // Eliminación de margen inferior
			left: "0.5in",
		},
	};

	pdf.create(modeloPDF, opcionesPDF).toStream((err, stream) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Error al generar el archivo PDF" });
		}

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", 'attachment; filename="archivo.pdf"');

		stream.pipe(res);
		//res.json({ok:true, cotizacion})
	});
};

module.exports = {
	DeleteCotizacion,
	UpdateCotizacion,
	consultaCotizacion,
	postCotizacion,
	GetIDCotizacion,
	ReporteCotizacion,
};
