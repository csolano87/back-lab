const { error } = require("console");
const { Request, Response } = require("express");
const fs = require("fs");
const csvToJson = require("convert-csv-to-json");
const Producto = require("../models/productos");
const { forIn } = require("lodash");
const { Op, Model, Sequelize, where } = require("sequelize");

const ItemStock = require("../models/itemStock");
const getProductos = async (req, res) => {
	const productos = await Producto.findAll(
		 /* ,
		include:[{
		model: ItemStock,
		as:'stockItem',
		attributes: [
			
			"referencia",
			
			"lote",
			[Sequelize.fn("SUM", Sequelize.col("cantidad_recibida")), "TOTAL"],
		],

		group: ["referencia", "lote", ],
		
	}

] */
	);
	res.status(200).json({
		ok: true,
		productos: productos,
	});
};

const getByProductos = async (req, res) => {
	const { q } = req.params;
	const dataCA = q.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});
	const productos = await Producto.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `${dataCA}%`,
			},
		},
	});
	console.log(productos)
	res.status(200).json({
		ok: true,
		productos: productos,
	});
};

const getByIdProductos = async (req, res) => {
	const { id } = req.params;

	const producto = await Producto.findByPk(id);

	if (!producto) {
		res.status(400).json({ ok: true, msg: `No existe id ${id}` });
	}

	res.status(200).json({ ok: true, productos: producto });
};

const createProductos = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ ok: false, msg: `No existe archivo` });
	}

	let fileInputName = req.file.path;

	let json = csvToJson.getJsonFromCsv(fileInputName);
	console.log(json);
	let productosGuardados = [];
	let productosDuplicados = [];
	for (const jsondata of json) {
		const datexistente = await Producto.findOne({
			where: { REFERENCIA: jsondata.REFERENCIA },
		});

		if (!datexistente) {
			const guardarProducto = await Producto.create(jsondata);
			productosGuardados.push(guardarProducto);
		} else {
			/* const existente = datexistente.map((ext)=>ext.producto)*/
			productosDuplicados.push(datexistente);
		}
	}

	const parseDuplicados = productosDuplicados.map(
		(ext) => ext.dataValues.REFERENCIA
	);
	const parseGuardados = productosGuardados.map(
		(ext) => ext.dataValues.REFERENCIA
	);

	if (productosGuardados.length > 0 && productosDuplicados.length > 0) {
		res.status(200).json({
			ok: true,
			msg: `Se han guardado con exito estos productos ${parseGuardados}, pero existen productos duplicados
                ${parseDuplicados},`,
		});
	} else if (productosGuardados.length > 0 && productosDuplicados.length == 0) {
		res.status(200).json({
			ok: true,
			msg: `Se ha ingresado con exito los siguientes productos  ${parseGuardados}`,
		});
	} else {
		res.status(200).json({
			ok: true,
			msg: `Los productos ingresados ya existen en el sistema ${parseDuplicados}`,
		});
	}
};



const postProductos = async (req, res) => {
	const { REFERENCIA, NOMBRE, CATEGORIA, UNIDAD, GENERACION, VALOR } = req.body;

	const productos = new Producto({
		REFERENCIA,
		NOMBRE,
		CATEGORIA,
		UNIDAD,
		GENERACION,
		VALOR}
	);
	const productoDB = await Producto.findOne({
		where: { REFERENCIA: productos.REFERENCIA },
	});

	if (productoDB) {
		return res.status(400).json({ok:true, msg:`El producto ${REFERENCIA} ya existe`})
	}
	await productos.save();

	res.status(201).json({ ok: true, msg: `Se guardo con el exito producto ${NOMBRE}` });
};
const updateProductos = async (req, res) => {
	const { id } = req.params;
	const { REFERENCIA, NOMBRE, CATEGORIA, UNIDAD, GENERACION, VALOR } = req.body;
	const producto = await Producto.findByPk(id);

	if (!producto) {
		res.status(400).json({ ok: true, msg: `No existe ID ${id}` });
	}

	await producto.update({
		REFERENCIA,
		NOMBRE,
		CATEGORIA,
		UNIDAD,
		GENERACION,
		VALOR,
	});

	res
		.status(200)
		.json({ ok: true, msg: `Se actualizo con exito el producto ${NOMBRE}` });
};

const deleteProductos = async (req, res) => {
	const { id } = req.params;

	const producto = await Producto.findByPk(id);
	if (!producto) {
		return res.status(404).json({
			ok: false,
			msg: `No existe el producto seleccionado ${id}`,
		});
	}

	await producto.update({ ESTADO: 0 });
	res.status(200).json({
		msg: "El producto a sido desactivado con exito...",
	});
};

module.exports = {
	getProductos,
	getByProductos,
	getByIdProductos,
	createProductos,
	postProductos,
	updateProductos,
	deleteProductos,
};
