const { Model } = require("sequelize");
const MenuRole = require("../models/menuRoles");
const Usuario = require("../models/usuarios");
const Role = require("../models/role");
const Menu = require("../models/menu");




const getMenuRoles = async (req, res) => {
    res.status(200).json({ msg: `DATA` })
}

const postMenuRoles = async (req, res) => {


    const { id, menu } = req.body;

    //console.warn(req.body);
    const usuario = await Usuario.findByPk(id, {
        include: {
            model: Role,
            as: "role",
            include: {
                model: Menu,
                as: "menu"
            }
        }
    });
    /* const menuId = usuario.role.menu;
    menuId.map(item=> console.log(`************`,item)) */
    const menuExistente = usuario.role.menu.map((item) => item.id);
    console.log(`menu existente`, menuExistente);
    const nuevosMenuIds = menu.map((a) => a.menuId);
    console.log(`nuevosIDs`, nuevosMenuIds);
    const menuParaEliminar = menuExistente.filter(
        (id) => !nuevosMenuIds.includes(id)
    )
    console.log(`acesorioseliminados`, menuParaEliminar);

    await MenuRole.destroy({
        where: {
            menuId: menuParaEliminar
        }
    });

    await Promise.all(
        menu.map(async (item) => {
            const { menuId, RoleId } = item;

            const menuExistentes = await MenuRole.findOne({
                where: {
                    menuId,
                    RoleId
                }


            })

            if (!menuExistentes) {
                await MenuRole.create({
                    menuId,
                    RoleId
                })
            }

        })
    )
    /* 
    for (const item of menu) {
        const {RoleId, menuId}=item;
        await MenuRole.create({
            menuId,
            RoleId
        })
    } */
    res.status(200).json({
        msg: `Se han guardado con exito los cambios generados al usuario ${usuario.doctor}`,
    })

}


module.exports = {
    getMenuRoles,
    postMenuRoles
}