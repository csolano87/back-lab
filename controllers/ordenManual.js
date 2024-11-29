const { sequelize } = require("../models/cabecera");
const Cabecera_Agen = require("../models/cabecera_agen");
const Detalle_Agen = require("../models/detalle_agen");
const fs = require("fs");
const { Mutex } = require("async-mutex");
const hisMutex = new Mutex();
const moment = require("moment");
const out_dir = String.raw`C:\Users\devel\Desktop\res-des`;

const path = require("path");
const ordenPost = async (req, res) => {
	const user = req.usuario;
	console.log(`****enviarinfinity***********`, req.body);
	moment.locale("es");
	const hoy = moment();
	const fecha = hoy.format().slice(2, 10).replaceAll("-", "");
	const fechaH = hoy.format().slice(0, 10).replaceAll("-", "");
	console.log(`fechaaaaa`, fecha);
	const fechaT = hoy.format("L").split("/");
	const fechaToma = fechaT[2] + "-" + fechaT[1] + "-" + fechaT[0];
	let Norden = 0;
	const horaToma = hoy.format("LTS");
	const releaseHisMutex = await hisMutex.acquire();
	try {
		const numeroOrdenBD = await Cabecera_Agen.findAll({
			attributes: ["NUMEROORDEN"],
			limit: 1,
			order: [["NUMEROORDEN", "DESC"]],
		});

		let numero = parseInt(
			`${numeroOrdenBD[0].dataValues.NUMEROORDEN}`.slice(-4)
		);

		console.log(`****`, numero);
		const rest =
			fecha - `${numeroOrdenBD[0].dataValues.NUMEROORDEN}`.slice(0, 6);
		if (isNaN(numero) || rest > 0) {
			let num = 0;
			Norden = `${num + 1}`.padStart(4, "0");
		} else {
			Norden = `${numero + 1}`.padStart(4, "0");
		}

		console.log(`****`, Norden);
		await sequelize.transaction(async (t) => {
			const {
				IDENTIFICADOR,
				NOMBRES,
				APELLIDO,

				FECHANACIMIENTO,
				EDAD,
				SEXO,

				CODTIPOORDEN,

				PRIORIDAD,
				APELLIDODOCTOR,
				NOMBREDOCTOR,
				CODDOCTOR,
				HIS,
				TELEFONO,
				EMAIL,
				CONVENCIONAL,
				CODEMBARAZADA,
				CODCENTROSALUD,
				DIRECCION,
				OPERADOR,

				CODFLEBOTOMISTA,
				CORRELATIVO,
				CODIMPRESORA,

				USUARIO_ID = user.id,
				ESTADO = 2,
			} = req.body;

			console.log("AGREGANDO ID5", req.body);

			const cabecera_agen = await Cabecera_Agen.create(
				{
					IDENTIFICADOR,
					NOMBRES,
					APELLIDO,
					FECHANACIMIENTO,
					EDAD,
					SEXO,
					CODTIPOORDEN,
					PRIORIDAD,
					APELLIDODOCTOR,
					NOMBREDOCTOR,
					CODDOCTOR,
					HIS: HIS == "Manual" ? 2 : "",
					TELEFONO,
					EMAIL,
					CONVENCIONAL,
					CODEMBARAZADA,
					CODCENTROSALUD,
					DIRECCION,
					OPERADOR,
					NUMEROORDEN: fecha + Norden,
					CODFLEBOTOMISTA,
					CORRELATIVO,
					CODIMPRESORA,

					USUARIO_ID,
					ESTADO,
				},
				{ transaction: t }
			);

			const createdDetails = await Detalle_Agen.bulkCreate(req.body.pruebas, {
				transaction: t,
			});

			await cabecera_agen.setAs400(createdDetails, { transaction: t });

			const idw = req.body.pruebas
				.filter((e) => e.ESTADO == "1")
				.map(
					(e, i) =>
						`O|${i + 1}|${fecha}${Norden}|${e.ItemID}|${fechaH}|${horaToma}`
				)
				.join("\n");

			const filename = path.join(out_dir, `${fecha + Norden}.ord`);
			const data = `H|^&|Roche^^Diagnostics|||OrderEntry^Interface||HPBO^^cobas_Infinity||||P|
        P|1|${fecha}${Norden}|${req.body.IDENTIFICADOR}|${req.body.APELLIDO}|${
				req.body.NOMBRES
			}|${req.body.FECHANACIMIENTO.replaceAll("-", "")}|${req.body.SEXO}|${
				req.body.CODDOCTOR
			}|${req.body.CODTIPOORDEN}||${req.body.CODCENTROSALUD}|${
				req.body.OPERADOR
			}|${req.body.CODFLEBOTOMISTA}|${req.body.CORRELATIVO}|${
				req.body.CODIMPRESORA
			}|${req.body.HIS}|${fechaH}|${horaToma}|
        ${idw}
        L|1|F`;

			/*	`H|^&|Roche^^Diagnostics|||OrderEntry^Interface||HPBO^^cobas_Infinity||||P|
        P|1|${fecha}${Norden}|${req.body.IDENTIFICADOR}|${req.body.APELLIDO}|${req.body.NOMBRES}|${req.body.FECHANACIMIENTO}|${req.body.SEXO}|${req.body.CODDOCTOR}|${req.body.CODTIPOORDEN}|${req.body.CODSALA}|${req.body.OPERADOR}|${req.body.CODFLEBOTOMISTA}|${req.body.CORRELATIVO}|${req.body.CODIMPRESORA}|${req.body.HIS}|${fecha}|${horaToma}
        ${idw}
        L|1|F`;*/
			fs.writeFileSync(`${filename}`, data);

			res.status(201).json({
				msg: `Se a integrado  la orden # ${req.body} para el paciente ${req.body.APELLIDO} ${req.body.NOMBRES} `,
			});
		});
	} catch (error) {
		console.log(`*****************ERROR*************`, error);
	} finally {
		releaseHisMutex();
	}
};

module.exports = {
	ordenPost,
};
