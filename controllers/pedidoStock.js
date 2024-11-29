const { Request, Response } = require("express");
const Pedido = require("../models/pedido");
const Producto = require("../models/productos");
const { Op, and, Sequelize, fn, col, where } = require("sequelize");

const Usuario = require("../models/usuarios");
const Itempedido = require("../models/itemPedido");
const { sequelize } = require("../models/pedido");
const Cliente = require("../models/cliente");
const Marca = require("../models/marca");
const { Fn } = require("sequelize/lib/utils");
const PedidoStock = require("../models/pedidostock");
const Itempedidostock = require("../models/itempedidostock");
const ItemStock = require("../models/itemStock");
const { promises } = require("nodemailer/lib/xoauth2");
const { includes } = require("lodash");

const { PDFDocument, rgb, hasUtf16BOM, utf16Decode } = require("pdf-lib");
const fs = require("fs");

const pdf = require("html-pdf");
const Bodega = require("../models/bodega");
const getPedidoStock = async (req, res) => {
	const pedidoStock = await PedidoStock.findAll({
		/* where: {
			ESTADO: [1, 2],
		}, */
		include: [
			{
				model: Itempedidostock,
				as: "itemstock",
				attributes: ["ID_PRODUCTO", "CANTIDAD"],
				include: [
					{ model: Producto, as: "product"},
					{ model: Bodega, as: "bodega" },
				],
			},
			{
				model: Usuario,
				as: "usuario",
				attributes: ["doctor"],
			},
		],
	});
	res.status(200).json({
		ok: true,
		pedidoStock: pedidoStock,
	});
};
const getAllPedidoStock = async (req, res) => {
	const json = req.params.id;

	const jsonPrueba = JSON.parse(json);

	const cantidadReservadaDetalle = [];
	const promises = jsonPrueba.itemstock.map(async (item) => {
		console.log(`>>>>>>>>>>>>>`,item)
		//const referencia = item.product.NOMBRE.trim().split('-');
		//console.log(item.product.id)
		const cantidad = item.CANTIDAD;

		const stokDisponiblePromises = ItemStock.findAll({
			where: { referencia: item.product.REFERENCIA},
			attributes: [
				[sequelize.fn("SUM", sequelize.col("cantidad_recibida")), "cantidad"],
				"referencia",
				"lote",
				"caducidad",
				"productoId",
			],
			group: ["referencia", "lote", "caducidad", "productoId"],
		});
		//console.log(`---->`, stokDisponiblePromises);
		const stockDisponible = await stokDisponiblePromises;
		/* stockDisponible.sort(
			(a, b) => new Date(a.caducidad) - new Date(b.caducidad)
		); */
		console.log(`-------------------------`, stockDisponible);

		const productosFiltradosYOrdenados = stockDisponible
			.filter((producto) => producto.cantidad > 0) // Filtramos los productos con stock mayor a 0
			.sort((a, b) => new Date(a.caducidad) - new Date(b.caducidad));

		let cantidadReservar = cantidad;
		//console.log(stockDisponible)
		productosFiltradosYOrdenados.forEach((objeto, i, array) => {
			console.log(`=======>`, objeto);
			let cantidadDisponible = objeto.cantidad;

			if (cantidadReservar <= 0) return;
			if (objeto.referencia === referencia || i === array.length - 1) {
				const cantidadreservada = Math.min(
					cantidadDisponible,
					cantidadReservar
				);

				objeto.cantidad_recibida -= cantidadreservada;

				cantidadReservadaTotal = cantidadreservada;

				cantidadReservar -= cantidadreservada;
				cantidadReservadaDetalle.push({
					productId: objeto.productoId,
					referencia: objeto.referencia,
					lote: objeto.lote,
					producto: objeto.productoId,
					cantidadReservada: cantidadReservadaTotal,
				});
			}
		});
	});

	Promise.all(promises)
		.then(() => {
			console.log(cantidadReservadaDetalle);

			//const detalle =Object.groupBy(cantidadReservadaDetalle,({referencia})=>referencia)
			res.status(200).json({
				ok: true,
				//cantidadReservada:detalle
				cantidadReservada: {
					detalle: cantidadReservadaDetalle,
				},
			});
		})
		.catch((error) => {
			console.error("Error:", error);
		});
};

const getFiltroPedidoStock = async (req, res) => {
	const { id } = req.params;

	const pedidoStock = await PedidoStock.findByPk(id, {
		attributes: ["id", "AREA"],
		include: [
			{
				model: Itempedidostock,
				as: "itemstock",
				//attributes:["ID_PROVEEDOR","MARCA"]
				attributes: ["ID_PRODUCTO", "CANTIDAD"],
				include: [
					{
						model: Producto,
						as: "product",
						//attributes: { exclude: ["createdAt", "updatedAt", "ESTADO"] },
					},
					{
						model: Bodega,
						as: "bodega",
					},
				],
			},
		],
	});
console.log(pedidoStock)
	res.status(200).json({ ok: true, pedidoStock: pedidoStock });
};

const createPedidoStock = async (req, res) => {
	const idUser = req.usuario;
	const { AREA, PRODUCTOS } = req.body;
	console.log(req.body);
	await sequelize.transaction(async (t) => {
		const pedidos = await PedidoStock.create(
			{
				AREA,

				usuarioId: idUser.id,
				userId: idUser.id,
				clientesId: AREA,

				/* marcasId: MARCA, */
			},
			{ transaction: t }
		);

		const itempedidostock = await Promise.all(
			PRODUCTOS.map(async (producto) => {
				const productoId = producto.id;
				console.log(productoId);
				return await Itempedidostock.create(
					{
						ID_PRODUCTO: producto.ID_PRODUCTO,
						CANTIDAD: producto.CANTIDAD,
						productId: producto.ID_PRODUCTO,
						producotId: producto.ID_PRODUCTO,

						ENTREGADO: PRODUCTOS.ENTREGADO,
						usuarioId: idUser.id,
						userId: idUser.id,
						bodegaId: AREA,
					},
					{ transaction: t }
				);
			})
		);

		await pedidos.setItemstock(itempedidostock, { transaction: t });
	});

	res.status(201).json({
		msg: "El pedido a sido registrado con exito",
	});
};

const updatePedidoStock = async (req, res) => {
	const id = req.body.id;

	const { AREA, PRODUCTOS } = req.body;
 console.log(1111)
	await sequelize.transaction(async (t) => {
		try {
			const pedido = await PedidoStock.findByPk(id, {
				include: [
					{
						model: Itempedidostock,
						as: "itemstock",
					},
				],
			});

			/* if (!pedido) {
				throw new Error("No se encontró el pedido");
			}
 */
			/* 	for (const producto of PRODUCTOS) {
				const { CANTIDAD, ENTREGADO, LOTE, ID_PRODUCTO } = producto;
			
				let cantidadesEntregadas = [];

				if (typeof ENTREGADO === "string") {
					const entregadoArray = ENTREGADO;
					console.log(`1`, entregadoArray);
					cantidadesEntregadas = entregadoArray;
				} else if (typeof ENTREGADO === "number") {
					console.log(`2`, ENTREGADO);
					cantidadesEntregadas = ENTREGADO.toString();
				}

				let nuevosLotes = [];
				console.log(`cant1`, cantidadesEntregadas);
				if (typeof LOTE === "string") {
					nuevosLotes = LOTE;
				} else if (typeof LOTE === "number") {
					nuevosLotes = LOTE.toString();;
				}

				console.log(`=======>`, nuevosLotes, cantidadesEntregadas);
				for (let i = 0; i < nuevosLotes.length; i++) {
					const lote = nuevosLotes[i];
					console.log(`lote`, lote);
					const cantidadEntregada = cantidadesEntregadas[i];
					console.log(`cant`, cantidadEntregada);
					ItemStock.decrement("cantidad_recibida", {
						by: ENTREGADO,
						where: {
							productoId: ID_PRODUCTO,
							lote: lote,
						},
						transaction: t,
					});
				} */

			for (const producto of PRODUCTOS) {
				const { CANTIDAD, ENTREGADO, LOTE, ID_PRODUCTO } = producto;

				// Convert ENTREGADO to an array if it's a comma-separated string
				let cantidadesEntregadas = [];
				if (typeof ENTREGADO === "string") {
					cantidadesEntregadas = ENTREGADO.split(","); // Split string into an array
				} else if (typeof ENTREGADO === "number") {
					cantidadesEntregadas = [ENTREGADO.toString()]; // Put number into an array
				}

				// Convert LOTE to an array if it's a comma-separated string
				let nuevosLotes = [];
				if (typeof LOTE === "string") {
					nuevosLotes = LOTE.split(","); // Split string into an array
				} else if (typeof LOTE === "number") {
					nuevosLotes = [LOTE.toString()]; // Put number into an array
				}

				console.log(`LOTE:`, nuevosLotes, `ENTREGADO:`, cantidadesEntregadas);

				// Iterate over the lotes and delivered quantities
				for (let i = 0; i < nuevosLotes.length; i++) {
					const lote = nuevosLotes[i];
					const cantidadEntregada = cantidadesEntregadas[i];

					console.log(
						`Lote: ${lote}, Cantidad Entregada: ${cantidadEntregada}`
					);

					// Ensure cantidadEntregada is valid before performing the decrement
					if (cantidadEntregada) {
						await ItemStock.decrement("cantidad_recibida", {
							by: cantidadEntregada, // Ensure it's a number
							where: {
								productoId: ID_PRODUCTO,
								lote: lote,
								bodegaId: 1,
							},
							transaction: t,
						});
					}
				}

				for (let i = 0; i < nuevosLotes.length; i++) {
					const lote = nuevosLotes[i];
					const cantidadEntregada = cantidadesEntregadas[i];

					console.log(`Lote===>>`, lote);

					// Actualizamos los registros de Itempedidostock en paralelo usando Promise.all
					await Promise.all(
						PRODUCTOS.map(async (item) => {
							const { ENTREGADO, LOTE } = item;

							// Convertimos ENTREGADO y LOTE en arrays si son strings
							const loteArray =
								typeof LOTE === "string" ? LOTE.split(",") : [LOTE.toString()];
							const entregadoArray =
								typeof ENTREGADO === "string"
									? ENTREGADO.split(",")
									: [ENTREGADO.toString()];

							console.log(`Updating:`, entregadoArray, loteArray);

							// Realizamos la actualización de Itempedidostock
							await Itempedidostock.update(
								{
									ENTREGADO: entregadoArray[i], // Usamos la cantidad correspondiente
									lote: loteArray[i], // Usamos el lote correspondiente
								},
								{
									where: {
										pedidostockId: id,
										ID_PRODUCTO: ID_PRODUCTO,
									},
									transaction: t,
								}
							);
						})
					);
				}

				// Actualizamos el estado de PedidoStock una vez que todas las actualizaciones de Itempedidostock han sido completadas
				await PedidoStock.update(
					{
						ESTADO: 2, // Estado actualizado
					},
					{
						where: { id: id },
						transaction: t,
					}
				);

				/* 
				for (let i = 0; i < nuevosLotes.length; i++) {
					const lote = nuevosLotes[i];
					console.log(`lote===>>`, lote);
					const cantidadEntregada = cantidadesEntregadas[i];
					await Promise.all(
						PRODUCTOS.map(async (item) => {
							const { ENTREGADO, LOTE } = item;
							console.log(`ok for`, ENTREGADO, LOTE);
							await Itempedidostock.update(
								{
									ENTREGADO: cantidadEntregada.split(","),
									lote: lote.split(","),
								},
								{
									where: {
										pedidostockId: id,
										ID_PRODUCTO: ID_PRODUCTO,
									},
									transaction: t,
								}
							);
						})
					);
				}

				await PedidoStock.update(
					{
						ESTADO: 2,
					},
					{
						where: { id: id },
						transaction: t,
					}
				); */
			}
		} catch (error) {
			console.log(error);
		}
	});

	res
		.status(200)
		.json({ ok: true, msg: `Se a realizado el despacho de de los productos` });
};

const deletePedidoStock = async (req, res) => {
	const { id } = req.params;
	console.log(id);

	const idPedido = await PedidoStock.findByPk(
		id /* {
			include: ["items"],
		} */
	);

	if (!idPedido) {
		return res.status(404).json({
			ok: false,
			msg: `No existe el pedido ${id}`,
		});
	}

	await PedidoStock.update(
		{
			ESTADO: 0,
		},
		{ where: { id: id } }
	);

	/* 	await Promise.all(
			idPedido.items.map(async (item) => {
				const { ESTADO } = item;
				await Itempedido.update(
					{
						ESTADO: 0,
					},
					{
						where: {
							pedidoId: id,
						},
						transaction: t,
					}
				);
			})
		); */

	res.status(200).json({
		msg: "El pedido a sido desactivado con exito...",
	});
};
const filtropedidoBodega = async (req, res) => {
	const { bodegaId } = req.query;
	console.log(`------>`, bodegaId);
	let where = {};
	if (bodegaId) {
		where.bodegaId = bodegaId;
	}
	const stock = await Itempedidostock.findAll({
		where,
		include: [
			{
				model: Producto,
				as: "product",
			},
			{ model: Bodega, as: "bodega" },
		],
		attributes: [
			"productId",
			"ID_PRODUCTO",
			"bodegaId",
			"lote",
			[Sequelize.fn("SUM", Sequelize.col("ENTREGADO")), "CANTIDAD"],
		],

		group: ["ID_PRODUCTO", "lote", "productId", "bodegaId"],
	});

	res.status(200).json({ ok: true, stock });
};
const getReportePdfPedidoStock = async (req, res) => {
	const { id } = req.params;

	const pedido = await PedidoStock.findByPk(id, {
		include: {
			model: Itempedidostock,
			as: "itemstock",
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
		},
	});
	console.log(`----->`, pedido);
	if (!pedido) {
		return res.status(400).json({ msg: "No existe orden creada" });
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
            <p style="color: #666; width: 70%; margin: 0; padding-bottom: 5px; text-align: let; font-family: sans-serif; font-size: .65em; float: left;"><p>Generado por: ${pedido}</p></h4>
            <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">Página {{ page }} de {{ pages }}</h4>
        </div>

        <h1> Reporte de Proceso</h1>
       

<div class="fila">
<div>
    <h4>Area:</h4>
    <p>${pedido.itemstock.bodega}</p>
	<h4>Fecha:</h4>
	<p>${pedido.FECHAPEDIDOSTOCK}</p>
</div>

</div>

        

         <div >
        <table>
            <thead>
                <tr>
         
                    <th>Referencia</th>
					<th>Descripcion del producto</th>
                    <th>Cantidad </th>
                    <th>Entregado</th>
                    <th>Lote </th>
                </tr>
            </thead>
            <tbody>
            ${pedido.itemstock
							.map(
								(key) => `
								<tr>
									<td>${key.product.REFERENCIA}</td>
									<td>${key.product.NOMBRE}</td>
									<td>${key.CANTIDAD}</td>
									<td>${key.ENTREGADO}</td>
									<td>${key.lote}</td>
								</tr>
								
							`
							)
							.join("")}
        </tbody>
        </table>
        </div>
       
        
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

	pdf.create(modeloPDF, opcionesPDF).toStream((err, stream) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Error al generar el archivo PDF" });
		}

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", 'attachment; filename="archivo.pdf"');

		stream.pipe(res);
	});

	//res.json({ok:true, pedido})
};

const updateStockPedido = async (req, res) => {
	const {
		productId,
		ID_PRODUCTO,
		bodegaId,
		lote,
		CANTIDAD,
		product,
		descargo,
	} = req.body;
	console.log(`---------->`, req.body);
	Itempedidostock.decrement("ENTREGADO", {
		by: Number(descargo),
		where: {
			ID_PRODUCTO: ID_PRODUCTO,
			bodegaId: bodegaId,
			//lote:lote,
		},
	});

	res.status(200).json({ ok: true, msg: "Producto actualizado en el BD" });
};
module.exports = {
	getReportePdfPedidoStock,
	getPedidoStock,
	getFiltroPedidoStock,
	getAllPedidoStock,
	createPedidoStock,
	updatePedidoStock,
	deletePedidoStock,
	filtropedidoBodega,
	updateStockPedido,
};
