const Menu = require("../models/menu");

const getMenu = async (req, res) => {
	const menu = await Menu.findAll();
   
	res.status(200).json({
		ok: true,
		menu:menu,
	});
};

const getByIdMenu = async (req, res) => {

	res.status(200).json({
		ok: true,
	});

};
const postMenu = async (req, res) => {
	const { nombre, padreId, ruta, orden } = req.body;
	const menus = new Menu({ nombre, padreId, ruta, orden });
	const menu = await Menu.findOne({ where: { nombre: menus.nombre } });
	if (menu) {
		res
			.status(401)
			.json({ ok: true, msg: `El nombre ${nombre} ya esta en uso ` });
	}
	await menus.save();

	res.status(200).json({
		ok: true,
		msg: "Se guardo con exito el menu",
	});
};
const DeleteMenu = async (req, res) => {
	res.status(200).json({
		ok: true,
		menu,
	});
};
const putMenu = async (req, res) => {
	res.status(200).json({
		ok: true,
		menu,
	});
};

module.exports = {
	getMenu,
	getByIdMenu,
	postMenu,
	DeleteMenu,
	putMenu,
};
