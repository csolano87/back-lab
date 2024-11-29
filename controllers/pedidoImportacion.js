const { Request, Response } = require("express");
const Pedido = require("../models/pedido");
const Producto = require("../models/productos");
const { Op, and, Sequelize, fn, col } = require("sequelize");

const Usuario = require("../models/usuarios");
const Itempedido = require("../models/itemPedido");
const { sequelize } = require("../models/pedido");
const Cliente = require("../models/cliente");
const Marca = require("../models/marca");
const { Fn } = require("sequelize/lib/utils");
const getPedido = async (req, res) => {
	const allPedido = await Pedido.findAll({
		/* where: {
			ESTADO: [1, 2],
		}, */
		include: [
			{
				model: Itempedido,
				as: "items",
				attributes: ["ID_PRODUCTO", "CANTIDAD"],
				include: [{ model: Producto, as: "product", attributes: ["NOMBRE"] }],
			},
			/* {
				model: Usuario,
				as: "user",
				attributes: ["doctor"],
			}, */
			{ model: Cliente, as: "clientes", attributes: ["NOMBRE"] },
			{ model: Marca, as: "marcas", attributes: ["NOMBRE"] },
		],
	});
	res.status(200).json({
		ok: true,
		pedido: allPedido,
	});
};
const getAllPedido = async (req, res) => {
	const { FECHADESDE, FECHAHASTA } = req.query;
	try {
		const filtro = await Itempedido.findAll({
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
			const pedidos = await Pedido.findAll({
				where: {
					ESTADO: 1,
					FECHAPEDIDO: {
						[Op.between]: [FECHADESDE, FECHAHASTA],
					},
				},
				include: ["items"],
			});

			if (pedidos.length == 0) {
				throw new Error("El rango seleccionado no tiene Informacion");
			}

			await Promise.all(
				pedidos.map(async (pedido) => {
					await Pedido.update(
						{
							ESTADO: 2,
						},
						{ where: { id: pedido.id }, transaction: t }
					);

					await Promise.all(
						pedido.items.map(async (item) => {
							await Itempedido.update(
								{
									ESTADO: 2,
								},
								{
									where: {
										pedidoId: item.pedidoId,
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

const getFiltroPedido = async (req, res) => {
	const { id } = req.params;

	const pedido = await Pedido.findByPk(id, {
		attributes: ["id", "ID_PROVEEDOR", "MARCA"],
		include: [
			{
				model: Itempedido,
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
	res.status(200).json({ ok: true, pedido: pedido });
};

const createPedido = async (req, res) => {
	const idUser = req.usuario;
	const { id, ID_PROVEEDOR, MARCA, PRODUCTOS } = req.body;
	console.log(`aaqui`, req.body);
	await sequelize.transaction(async (t) => {
		const pedidos = await Pedido.create(
			{
				ID_PROVEEDOR,
				MARCA,
				usuarioId: idUser.id,
				userId: idUser.id,
				clientesId: ID_PROVEEDOR,
				marcasId: MARCA,
				pedidosId: id,
			},
			{ transaction: t }
		);

		const itempedidos = await Promise.all(
			PRODUCTOS.map(async (producto) => {
				const productoId = producto.id;
				console.log(productoId);
				return await Itempedido.create(
					{
						ID_PRODUCTO: producto.ID_PRODUCTO,
						CANTIDAD: producto.CANTIDAD,
						productId: producto.ID_PRODUCTO,
					},
					{ transaction: t }
				);
			})
		);

		await pedidos.setItems(itempedidos, { transaction: t });
	});

	res.status(201).json({
		msg: "El pedido a sido registrado con exito",
	});
};

const updatePedido = async (req, res) => {
	const id = req.body.id;
	const { ID_PROVEEDOR, MARCA, PRODUCTOS } = req.body;
	await sequelize.transaction(async (t) => {
		try {
			const pedido = await Pedido.findByPk(id);
			if (!pedido) {
				throw new Error("No se encontró el pedido ");
			}

			await Pedido.update(
				{ ID_PROVEEDOR, MARCA },
				{ where: { id: id }, transaction: t }
			);

			await Promise.all(
				PRODUCTOS.map(async (item) => {
					const { CANTIDAD } = item;
					await Itempedido.update(
						{
							CANTIDAD,
						},
						{
							where: {
								pedidoId: id,
							},
							transaction: t,
						}
					);
				})
			);
		} catch (error) {
			console.log(error);
		}
	});
	res.status(200).json({ ok: true, msg: `El pedido ${id} a sido actualizado` });
};

const deletePedido = async (req, res) => {
	const { id } = req.params;

	await sequelize.transaction(async (t) => {
		const idPedido = await Pedido.findByPk(id, {
			include: ["items"],
		});

		if (!idPedido) {
			return res.status(404).json({
				ok: false,
				msg: `No existe el pedido ${id}`,
			});
		}

		await Pedido.update(
			{
				ESTADO: 0,
			},
			{ where: { id: id }, transaction: t }
		);

		await Promise.all(
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
		);
	});

	res.status(200).json({
		msg: "El pedido a sido desactivado con exito...",
	});
};

module.exports = {
	getPedido,
	getFiltroPedido,
	getAllPedido,
	createPedido,
	updatePedido,
	deletePedido,
};
