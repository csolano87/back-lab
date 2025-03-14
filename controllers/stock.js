const { Request, Response } = require("express");
const { Op, and, Sequelize, fn, col, Model } = require("sequelize");
const Usuario = require("../models/usuarios");
const fs = require("fs");
const { sequelize } = require("../models/stock");
const path = require("path");
const moment = require("moment");
const puppeteer = require("puppeteer");
const { Fn } = require("sequelize/lib/utils");
const Stock = require("../models/stock");
const ItemStock = require("../models/itemStock");
const Producto = require("../models/productos");
const Correo = require("../models/correos");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const Bodega = require("../models/bodega");
const { error } = require("pdf-lib");
const { orderBy } = require("lodash");
const { header } = require("express-validator");
const Stocktemp = require("../models/stockTemp");
const ItemStocktemp = require("../models/itemStockTemp");

const getStock = async (req, res) => {
	const all = await ItemStock.findAll({
		where: { bodegaId: 1 },
		include: {
			model: Producto,
			as: "product",
		},
		attributes: [
			"productId",
			"referencia",
			"caducidad",
			"lote",
			[Sequelize.fn("SUM", Sequelize.col("cantidad_recibida")), "TOTAL"],
		],

		group: ["referencia", "lote", "productId", "caducidad"],
	});
	console.log(all.product);
	const allStock = all.reduce((acc, item) => {
		const referencia = item.referencia;
		const nombre = item.product.NOMBRE;

		console.log(nombre);
		if (!acc[referencia]) {
			acc[referencia] = {
				referencia: referencia,
				nombre: nombre,

				detalles: [],
				total_referencia: 0,
			};
		}
		acc[referencia].detalles.push({
			lote: item.lote,
			TOTAL: item.get("TOTAL"),
			caducidad: item.caducidad,
		});
		acc[referencia].total_referencia += Number(item.get("TOTAL"));
		return acc;
	}, {});
	const finalResults = Object.values(allStock);
	res.status(200).json({
		ok: true,
		stock: finalResults,
	});
}; //listadogetStock

/*
 * TODO: Listado de bodega temporal */
const listadogetStock = async (req, res) => {
	/* const all = await ItemStock.findAll({
		where: { bodegaId: 1 },
		include: {
			model: Producto,
			as: "product",
		},
		attributes: [
			"productId",
			"referencia",
			"caducidad",
			"lote",
			[Sequelize.fn("SUM", Sequelize.col("cantidad_recibida")), "TOTAL"],
		],

		group: ["referencia", "lote", "productId", "caducidad"],
	});

	const allStock = all.reduce((acc, item) => {
		const referencia = item.referencia;
		const nombre = item.product.NOMBRE;
		if (!acc[referencia]) {
			acc[referencia] = {
				referencia: referencia,
				nombre: nombre,
				detalles: [],
				total_referencia: 0,
			};
		}
		acc[referencia].detalles.push({
			lote: item.lote,
			TOTAL: item.get("TOTAL"),
			caducidad: item.caducidad,
		});
		acc[referencia].total_referencia += Number(item.get("TOTAL"));
		return acc;
	}, {});
	const finalResults = Object.values(allStock); */
	const stock = await Stocktemp.findAll({
		include: {
			model: ItemStocktemp,
			as: "stockItemtemp",
		},
		order: [["id", "DESC"]],
	});

	res.status(200).json({
		ok: true,
		stock: stock,
	});
};
const getAllStock = async (req, res) => {
	const { FECHADESDE, FECHAHASTA } = req.query;
	try {
		const filtro = await ItemStock.findAll({
			where: {
				ESTADO: 1,
				fecha: {
					[Op.between]: [FECHADESDE, FECHAHASTA],
				},
			},
			attributes: [[fn("SUM", col("CANTIDAD")), "Total"], "productId"],
			group: ["productId"],
			include: [
				{
					model: Producto,
					as: "product",
				},
			],
		});

		await sequelize.transaction(async (t) => {
			const Stocks = await Stock.findAll({
				where: {
					ESTADO: 1,
					FECHAStock: {
						[Op.between]: [FECHADESDE, FECHAHASTA],
					},
				},
				include: ["items"],
			});

			if (Stocks.length == 0) {
				throw new Error("El rango seleccionado no tiene Informacion");
			}

			await Promise.all(
				Stocks.map(async (Stock) => {
					await Stock.update(
						{
							ESTADO: 2,
						},
						{ where: { id: Stock.id }, transaction: t }
					);

					await Promise.all(
						Stock.items.map(async (item) => {
							await ItemStock.update(
								{
									ESTADO: 2,
								},
								{
									where: {
										StockId: item.StockId,
									},
									transaction: t,
								}
							);
						})
					);
				})
			);
		});
		res.status(200).json({
			ok: true,
			filtro: filtro,
		});
	} catch (error) {
		console.error("Error en la transacción:", error);
		res.status(500).json({
			ok: false,
			msg: "El rango seleccionado no tiene Informacion",
		});
	}
};
const getBusquedaStock = async (req, res) => {
	const { termino } = req.params;
	console.log(termino);
	const dataCA = termino.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});
	const busquedaStock = await ItemStock.findAll({
		where: {
			referencia: {
				[Op.like]: `%${dataCA}%`,
			},
		},
		include: [
			{
				model: Producto,
				as: "product",
			},
			{
				model: Bodega,
				as: "bodega",
			},
		],

		attributes: [
			"productId",
			"referencia",
			"bodegaId",
			"caducidad",
			"lote",
			[Sequelize.fn("SUM", Sequelize.col("cantidad_recibida")), "TOTAL"],
		],

		group: ["referencia", "bodegaId", "lote", "productId", "caducidad"],
	});
	const allStock = busquedaStock.reduce((acc, item) => {
		const referencia = item.referencia;
		const nombre = item.product.NOMBRE;
		if (!acc[referencia]) {
			acc[referencia] = {
				referencia: referencia,
				nombre: nombre,
				detalles: [],
				total_referencia: 0,
			};
		}
		acc[referencia].detalles.push({
			lote: item.lote,
			bodega: item.bodegaId,
			TOTAL: item.get("TOTAL"),
			caducidad: item.caducidad,
		});
		acc[referencia].total_referencia += Number(item.get("TOTAL"));
		return acc;
	}, {});
	const finalResults = Object.values(allStock);
	finalResults;
	res.status(200).json({ ok: true, resultados: finalResults });
};
const getFiltroStock = async (req, res) => {
	const { id } = req.params;

	const Stock = await Stock.findByPk(id, {
		attributes: ["id", "ID_PROVEEDOR", "MARCA"],
		include: [
			{
				model: ItemStock,
				as: "items",
				//attributes:["ID_PROVEEDOR","MARCA"]
				attributes: ["ID_PRODUCTO", "CANTIDAD"],
				include: {
					model: Producto,
					as: "product",
					attributes: { exclude: ["createdAt", "updatedAt", "ESTADO"] },
				},
			},
		],
	});
	res.status(200).json({ ok: true, Stock: Stock });
};
/*
 * ? Get Id de tabla temporal */
const getByIdStock = async (req, res) => {
	const { id } = req.params;

	const stock = await Stocktemp.findByPk(id, {
		include: [
			{
				model: ItemStocktemp,
				as: "stockItemtemp",

				include: {
					model: Producto,
					as: "product",
					attributes: { exclude: ["createdAt", "updatedAt", "ESTADO"] },
				},
			},
		],
	});

	if (!stock) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe `,
		});
	}
	res.status(200).json({ ok: true, StockId: stock });
};
/*
 * ?  Metodo post guarda los datos en el tabla temporal
 */
const createStock = async (req, res) => {
	const idUser = req.usuario;
	const { guia, bodegaId, proveedor, productos } = req.body;

	const maillist = await Correo.findAll({ where: { empresa: proveedor } });
	const correos = maillist.map((mail) => mail.correo).join(",");
	console.log(`maillist`, correos);
	const validadGuia = await Stocktemp.findOne({ where: { guia: guia } });
	const attachments = [];
	const productoNoEncontrados = [];
	const productoEncontrados = [];
	if (validadGuia) {
		return res
			.status(400)
			.json({ ok: true, msg: `La guia ${guia} ya fue ingresada` });
	}

	for (const producto of productos) {
		const Idproducto = await Producto.findOne({
			where: { REFERENCIA: producto.referencia },
		});
		console.warn(`IDproducto`, Idproducto);
		if (Idproducto) {
			productoEncontrados.push({
				id: Idproducto.id,
				referencia: Idproducto.REFERENCIA,
			});
		} else {
			productoNoEncontrados.push(producto.referencia);
		}
	}
	console.table(productoNoEncontrados);
	if (productoNoEncontrados.length > 0) {
		return res.status(400).json({
			msg: `Los siguientes productos no estan agregados:
           ${productoNoEncontrados.join(", ")}`,
		});
	}

	await sequelize.transaction(async (t) => {
		const stocks = await Stocktemp.create(
			{
				guia: guia,

				usuario: idUser.id,
			},
			{ transaction: t }
		);

		const itemStocks = await Promise.all(
			productos.map(async (producto) => {
				const pro = productoEncontrados.find(
					(et) => et.referencia === producto.referencia
				);

				return await ItemStocktemp.create(
					{
						referencia: producto.referencia,
						lote: producto.lote,
						caducidad: moment(producto.caducidad, "YYYY/MM/DD")
							.format()
							.slice(0, 10),
						cantidad: producto.cantidad,

						cantidad: producto.cantidad,
						cantidad_recibida: producto.cantidad,

						fabricante: producto.fabricante ? producto.fabricante : "",
						sanitario: producto.sanitario ? producto.sanitario : "",
						comentario: producto.comentario,
						productoId: pro.id,
						productId: pro.id,
						bodegaId: bodegaId,
					},
					{ transaction: t }
				);
			})
		);
		await stocks.setStockItemtemp(itemStocks, { transaction: t });
	});
	function createTableRow(
		referencia,
		descripcion,
		lote,
		caducidad,
		cantidad,
		cantidad_recibida,
		comentario
	) {
		return `
		<tr >
		<td>${referencia}</td>
			<td>${descripcion}</td>
			<td>${lote}</td>
			<td>${caducidad}</td>
				<td>${cantidad}</td>
			<td>${cantidad_recibida}</td>
			<td>${comentario}</td>
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
			<div id="pageHeader" style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">
			<img src="/Encabezado1.png" alt="" />
			</div>
			<div id="pageFooter" style="border-top: 1px solid #ddd; padding-top: 5px;">
				<p style="color: #666; width: 70%; margin: 0; padding-bottom: 5px; text-align: let; font-family: sans-serif; font-size: .65em; float: left;"><p>Generado por: 
				
				</p></h4>
				<p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">Página {{ page }} de {{ pages }}</h4>
			</div>
	
			<h1> Reporte de Guia recibidad</h1>
		   
	
	
	<div class="fila">
<div>
    <h4>Guia #:</h4>
    <p>${req.body.guia}</p>
</div>

</div>
			
			
		
	
	
			 <div >
			<table>
				<thead>
					<tr>
					<th>Referencia</th>
						<th>Descripcion</th>
						<th>Lote </th>
						<th>caducidad</th>
						<th>Cantidad </th>

						<th>recibida</th>
						<th>comentario </th>
					</tr>
				</thead>
				<tbody>
				${req.body.productos
			.map((key) => {
				return createTableRow(
					key.referencia,
					key.descripcion,
					key.lote,
					key.caducidad,
					key.cantidad,
					key.cantidad_recibida,
					key.comentario
				);
			})
			.join("")}
			</tbody>
			</table>
			</div>
			
			
		</body>
	</html>
	 `;

	/* const opcionesPDF = {
		format: 'Letter',
		orientation: 'portrait',
		border: {
			top: '1px', // default is 0, units: mm, cm, in, px
			right: '3px',
			bottom: '2px',
			left: '3px',
		},
	};

	pdf.create(modeloPDF, opcionesPDF).toBuffer((err, buffer) => {
		attachments.push({
			filename: 'reporte.pdf',
			content: buffer,
		});

		let transporter;
		transporter = nodemailer.createTransport({
			host: 'smtp.office365.com',
			port: 587,
			secure: false,
			requireTLS: true,

			auth: {
				user: 'christian.solano@distprolab.com',
				pass: 'D1stprol@2021',
			},
		});

		let mail_options = {
			from: '"SISTEMAS" <christian.solano@distprolab.com>',
			to: [correos],

			subject: `Recepcion de Bodega`,
			attachments: attachments,
		};

		transporter.sendMail(mail_options, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log('Correo se envió con éxito: ' + info.response);
			
			}
		});
	}); */

	res.status(201).json({
		msg: "El Stock a sido registrado con exito",
	});
};
//TODO: Cambiar de tabla y guardar en bodega
const updateStock = async (req, res) => {
	const id = req.body.id;
	const idUser = req.usuario;
	const { guia, bodegaId, proveedor, productos } = req.body;

	const validadGuia = await Stock.findOne({ where: { guia: guia } });
	const attachments = [];
	const productoNoEncontrados = [];
	const productoEncontrados = [];
	if (validadGuia) {
		return res
			.status(400)
			.json({ ok: true, msg: `La guia ${guia} ya fue ingresada` });
	}

	for (const producto of productos) {
		const Idproducto = await Producto.findOne({
			where: { REFERENCIA: producto.referencia },
		});
		console.warn(`IDproducto`, Idproducto);
		if (Idproducto) {
			productoEncontrados.push({
				id: Idproducto.id,
				referencia: Idproducto.REFERENCIA,
			});
		} else {
			productoNoEncontrados.push(producto.referencia);
		}
	}
	console.table(productoNoEncontrados);
	if (productoNoEncontrados.length > 0) {
		return res.status(400).json({
			msg: `Los siguientes productos no estan agregados:
           ${productoNoEncontrados.join(", ")}`,
		});
	}

	await sequelize.transaction(async (t) => {
		const stocks = await Stock.create(
			{
				guia: guia,

				usuario: idUser.id,
			},
			{ transaction: t }
		);

		const itemStocks = await Promise.all(
			productos.map(async (producto) => {
				const pro = productoEncontrados.find(
					(et) => et.referencia === producto.referencia
				);

				return await ItemStock.create(
					{
						referencia: producto.referencia,
						lote: producto.lote,
						caducidad: moment(producto.caducidad, "YYYY/MM/DD")
							.format()
							.slice(0, 10),
						cantidad: producto.cantidad,

						cantidad: producto.cantidad,
						cantidad_recibida: producto.cantidad,

						fabricante: producto.fabricante ? producto.fabricante : "",
						sanitario: producto.sanitario ? producto.sanitario : "",
						comentario: producto.comentario,
						productoId: pro.id,
						productId: pro.id,
						bodegaId: bodegaId,
					},
					{ transaction: t }
				);
			})
		);

		await stocks.setStockItem(itemStocks, { transaction: t });
		await Stocktemp.destroy({ where: { id: id }, transaction: t });
	});
	/* 
	const stock = await Stocktemp.findByPk(id, {
		include: [
			{
				model: ItemStocktemp,
				as: "stockItemtemp",

				include: {
					model: Producto,
					as: "product",
					attributes: { exclude: ["createdAt", "updatedAt", "ESTADO"] },
				},
			},
		],
	}); */

	/* 	await sequelize.transaction(async (t) => {
		try {
				const Stock = await Stock.findByPk(id);
			if (!Stock) {
				throw new Error("No se encontró el Stock ");
			} 

			await Stock.update(
				{ ID_PROVEEDOR, MARCA },
				{ where: { id: id }, transaction: t }
			);

			await Promise.all(
				PRODUCTOS.map(async (item) => {
					const { CANTIDAD } = item;
					await ItemStock.update(
						{
							CANTIDAD,
						},
						{
							where: {
								StockId: id,
							},
							transaction: t,
						}
					);
				})
			);
		} catch (error) {
			console.log(error);
		}
	}); */
	res.status(200).json({ ok: true, msg: `El Stock ${id} a sido actualizado` });
};

const deleteStock = async (req, res) => {
	const { id } = req.params;

	await sequelize.transaction(async (t) => {
		const idStock = await Stock.findByPk(id, {
			include: ["items"],
		});

		if (!idStock) {
			return res.status(404).json({
				ok: false,
				msg: `No existe el Stock ${id}`,
			});
		}

		await Stock.update(
			{
				ESTADO: 0,
			},
			{ where: { id: id }, transaction: t }
		);

		await Promise.all(
			idStock.items.map(async (item) => {
				const { ESTADO } = item;
				await ItemStock.update(
					{
						ESTADO: 0,
					},
					{
						where: {
							StockId: id,
						},
						transaction: t,
					}
				);
			})
		);
	});

	res.status(200).json({
		msg: "El Stock a sido desactivado con exito...",
	});
};

const getStockPdf = async (req, res) => {
	const fecha = moment().format("L");
	const hora = moment().format("LTS");
	const imgPath = path.join(__dirname, "../public/Encabezado1.png");

	const imgBase64 = fs.readFileSync(imgPath).toString("base64");

	const imgSrc = `data:image/png;base64,${imgBase64}`;
	const user = req.usuario;
	console.log(req.usuario);
	const stock = await ItemStock.findAll({
		where: { bodegaId: 1 },
		include: [
			{
				model: Producto,
				as: "product",
			},
			{
				model: Bodega,
				as: "bodega",
			},
		],
	});
	function convertirFecha(fecha) {
		const date = new Date(fecha);

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Mes (0-11) + 1
		const day = String(date.getDate()).padStart(2, "0"); // Día del mes (1-31)

		return `${year}/${month}/${day}`;
	}
	let totalGeneral = 0;
	stock.sort((a, b) => {
		const nombreA = a.product.NOMBRE.toUpperCase().trim();
		const nombreB = b.product.NOMBRE.toUpperCase().trim();

		if (nombreA < nombreB) return -1;
		if (nombreA > nombreB) return 1;
		return 0;
	});

	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: {
			width: 750,
			height: 500,
			defaultViewport: 1,
			isMobile: true,
			hasTouch: false,
			isLandscape: false,
		},
	});
	const page = await browser.newPage();

	const htmlContent = `

<html>
    <head>

            <style>
						
                body {
                    font-family: Georgia,'Times New Roman', Times, serif;
                  
    
	}
                p{
                    margin:5px 70px;
                   }

                .content{
                   padding-top:20px;
									 padding-bottom:5px;
                     }


                    
                  

             

              table {

    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; 
		  padding-top:20px;
		
}
thead {
  display: table-header-group;
  break-inside: avoid;
}
th, td {
    border: 1px solid #ddd;
   padding:12px;
    text-align: left;
    
}
.text_des{
width:30%;}
.text_cant{
width:8%;}

               

                th {
								
                    background-color: #f2f2f2;
										
                    font-size: 0.8rem;
                    font-weight: bold;
                        }

                td {
                    font-size: 0.65rem;
                        }

               
                       
                
                     
                

                        .page-break {
                            page-break-before: always;
                        }
            </style>



    </head>
    <body>
       


        
       



        <div>

       
        <table>
            <thead>
                <tr>
         
                    <th>Referencia</th>
					<th class="text_des">Descripcion</th>
                    <th  >Bodega</th>
										<th>Proveedor</th>
                    <th>Fecha caducidad</th>
                    <th>Lote </th>
					<th class="text_cant">Cantidad </th>
				
                </tr>
            </thead>
      <tbody>
    ${stock
			.map((key) => {
				const totalPorProducto = key.cantidad_recibida * key.product.VALOR;
				totalGeneral += totalPorProducto;
				return `
        <tr>
            <td>${key.product.REFERENCIA}</td>
            <td>${key.product.NOMBRE}</td>							
            <td>${key.bodega.NOMBRE}</td>
            <td>${key.fabricante}</td>
            <td>${convertirFecha(key.caducidad)}</td>
            <td>${key.lote}</td>
            <td>${key.cantidad_recibida}</td>
        </tr>
        `;
			})
			.join("")}
</tbody>
        </table>
        
       
        </div>
    </body>
</html>
 `;

	await page.setContent(htmlContent, { waitUntil: "networkidle0" });

	await page.emulateMediaType("screen");
	const pdf = await page.pdf({
		path: "reporte.pdf",
		format: "A4",
		landscape: true,
		displayHeaderFooter: true,
		border: {
			top: "15mm",
			right: "10mm",
			bottom: "15mm",
			left: "10mm",
		},
		printBackground: true,
		margin: { top: "150px", bottom: "40px" },
		headerTemplate: `
<style>

.portada{
margin:10px auto;
padding:10px 20px;
}
.text_title{width:100%;text-align: center;
font-size:28px;



}
.text_subtitle{
width:100%;text-align: center;
font-size:24px;

}


</style>

 
<div class="portada" > 
<h1 class="text_title">UEES</h1>
<p class="text_subtitle">Informe  General Laboratorio</p>
</div>

 





 

`,
		footerTemplate: `<div style="font-size:10px; text-align:center; width:100%;">
		
		Página <span class="pageNumber"></span> de
    <span class="totalPages"></span>
</div>


<div style="font-size:10px;text-align:left;  width:10%;">
<span>${fecha} ${hora}</span>
</div>`,
	});
	await browser.close();

	res.setHeader("Content-Type", "application/pdf");
	res.setHeader("Content-Disposition", 'attachment; filename="archivo.pdf"');

	res.end(pdf);

	/*  const opcionesPDF = {
		format: 'A4',
		orientation: 'landscape',
		header: {
			height: '20mm',
			contents: `<div style="text-align: center;">  <h1>Informe  General Laboratorio</h1></div>`
		},
		footer: {
			height: '20mm',
			contents: {
				default: '<span style="color: #444;margin-bottom:10px;text-align:center;">Página {{page}} de {{pages}}</span>'
			}
		},
		border: {
			top: '15mm',
			right: '10mm',
			bottom: '15mm',
			left: '10mm'
		},
	};

	pdf.create(modeloPDF, opcionesPDF).toStream((err, stream) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: 'Error al generar el archivo PDF' });
		}
 


		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader(
			'Content-Disposition',
			'attachment; filename="ReporteStock.pdf"'
		);

		stream.pipe(res);
	}); */
};

const cargarexcelStock = async (req, res) => {
	const idUser = req.usuario;
	const { guia, bodegaId, proveedor, productos } = req.body;

	const maillist = await Correo.findAll({ where: { empresa: proveedor } });
	const correos = maillist.map((mail) => mail.correo).join(",");
	console.log(`maillist`, correos);
	const validadGuia = await Stock.findOne({ where: { guia: guia } });
	const attachments = [];
	const productoNoEncontrados = [];
	const productoEncontrados = [];
	if (validadGuia) {
		return res
			.status(400)
			.json({ ok: true, msg: `La guia ${guia} ya fue ingresada` });
	}

	for (const producto of productos) {
		const Idproducto = await Producto.findOne({
			where: { REFERENCIA: producto.referencia },
		});
		console.warn(`IDproducto`, Idproducto);
		if (Idproducto) {
			//productoNoEncontrados.push(producto.referencia);
			productoEncontrados.push({
				id: Idproducto.id,
				referencia: Idproducto.REFERENCIA,
			});
		} else {
			productoNoEncontrados.push(producto.referencia);
		}
		/* productoEncontrados.push({
			id: Idproducto.id,
			referencia: Idproducto.REFERENCIA,
		}); */
	}
	console.table(productoNoEncontrados);
	if (productoNoEncontrados.length > 0) {
		return res.status(400).json({
			msg: `Los siguientes productos no estan agregados:
           ${productoNoEncontrados.join(", ")}`,
		});
	}

	await sequelize.transaction(async (t) => {
		const stocks = await Stock.create(
			{
				guia: guia,

				usuario: idUser.id,
			},
			{ transaction: t }
		);

		const itemStocks = await Promise.all(
			productos.map(async (producto) => {
				const pro = productoEncontrados.find(
					(et) => et.referencia === producto.referencia
				);
				console.log(`------------`, pro);
				return await ItemStock.create(
					{
						referencia: producto.referencia,
						lote: producto.lote,
						caducidad: moment(producto.caducidad, "YYYY/MM/DD")
							.format()
							.slice(0, 10),
						cantidad: producto.cantidad,
						//cantidad_recibida: producto.cantidad_recibida,
						cantidad: producto.cantidad,
						//cantidad_recibida: producto.cantidad,
						//	cantidad_recibida: producto.cantidad_recibida,
						fabricante: producto.fabricante ? producto.fabricante : "",
						sanitario: producto.sanitario ? producto.sanitario : "",
						comentario: producto.comentario,
						productoId: pro.id,
						productId: pro.id,
						bodegaId: bodegaId,
					},
					{ transaction: t }
				);
			})
		);
		await stocks.setStockItem(itemStocks, { transaction: t });
	});

	res.status(201).json({
		msg: "se ha cargado con exito la guia ",
	});
};

const getByIdcargarexcelStock = async (req, res) => {
	const { id } = req.params;
	const stockId = await Stock.findAll({
		include: {
			model: ItemStock,
			as: "stockItem",
		},
	});

	res.status(200).json({
		ok: true,
		stockId: stockId,
	});
};

module.exports = {
	getStock,
	getFiltroStock,
	getBusquedaStock,
	getAllStock,
	createStock,
	updateStock,
	deleteStock,
	getStockPdf,
	cargarexcelStock,
	listadogetStock,
	getByIdcargarexcelStock,
	getByIdStock,
};
