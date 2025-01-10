const Menu = require("../models/menu");

const getMenu = async (req, res) => {
	const menu = await Menu.findAll();
   
	res.status(200).json({
		ok: true,
		menu:menu,
	});
};

const getByIdMenu = async (req, res) => {
      const {id}= req.params;
	  console.log(id);
	  const menu = await Menu.findByPk(id);
	  if (!menu) {
		return res.status(404).json({o:false,msg:`El id ${id} no exta registrado`})
	  }
	res.status(200).json({
		ok: true,
		menu
	});

};
const postMenu = async (req, res) => {
	const { nombre, padreid, ruta, orden } = req.body;
	console.log(padreid)
	const menus = new Menu({ nombre, padreid, ruta, orden });
	const menu = await Menu.findOne({ where: { nombre: menus.nombre } });
/* 	if (menu) {
		res
			.status(401)
			.json({ ok: true, msg: `El nombre ${nombre} ya esta en uso ` });
	} */
	await menus.save();
	


	res.status(200).json({
		ok: true,
		msg: "Se guardo con exito el menu",
	});
};
const DeleteMenu = async (req, res) => {

	const {id}= req.params;
	const menu = await Menu.findByPk(id);
	if (!menu) {
		return res.status(404).json({o:false,msg:`El id ${id} no exta registrado`})
	  }
await menu.update({estado:0});
	res.status(200).json({
		ok: true,
		msg:`El menu con id ${id} a sido desactivado`,
	});
};
const putMenu = async (req, res) => {

	const {id}= req.params;
	const {nombre , ruta , padreid,orden}=req.body
	const menu = await Menu.findByPk(id);
	if (!menu) {
		return res.status(404).json({o:false,msg:`El id ${id} no exta registrado`})
	  }

       await Menu.update({
		nombre , ruta , padreid,orden
	   },{where:{id:id}});



	res.status(200).json({
		ok: true,
		msg:`Los datos han sido actualizados con exito`,
	});
};

module.exports = {
	getMenu,
	getByIdMenu,
	postMenu,
	DeleteMenu,
	putMenu,
};
