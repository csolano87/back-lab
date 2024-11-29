const { Request, Response } = require("express");
const { Op, and } = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const bcryptjs = require("bcryptjs");
const { Mutex } = require("async-mutex");
const Cabecera = require("../models/cabecera");
const Detalle = require("../models/detalle");
const path = require("path");
const { where } = require("sequelize");
const { sequelize } = require("../models/cabecera");
const db = require("../db/connection");
const Usuario = require("../models/usuarios");
const Cabecera_Agen = require("../models/cabecera_agen");
const hisMutex = new Mutex();
//const out_dir = String.raw`C:\Roche\CobasInfinity\Infinity\Temp\HCA\ORDENES`;C:\Users\devel\Desktop\res-des
const out_dir = String.raw`C:\Users\devel\Desktop\res-des`;
const generarhl7 = async (req, res) => {
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
      `${numeroOrdenBD[0].dataValues.NUMEROORDEN}`.slice(-4),
    );

    const rest =
      fecha - `${numeroOrdenBD[0].dataValues.NUMEROORDEN}`.slice(0, 6);
    if (isNaN(numero) || rest > 0) {
      let num = 0;
      Norden = `${num + 1}`.padStart(4, "0");
    } else {
      Norden = `${numero + 1}`.padStart(4, "0");
    }
    console.log(`*****`, fecha, Norden);
    /* const {

			HORATOMA ,
			FECHATOMA ,
			CODIMPRESORA,
			NUMEROORDEN,
            			ESTADO,
		} = req.body;


        
await Cabecera_Agen.update({
    HORATOMA:horaToma,
				FECHATOMA:fechaToma,
				CODIMPRESORA,
				NUMEROORDEN:fecha+Norden,
				ESTADO:2},
			{ where: { id: req.body.id } }
            )

req.body.HIS = "1";
const idw = req.body.pruebas.filter((e) => e.ESTADO == '1').map((e, i) => `O|${i + 1}|${fecha}${Norden}|${e.ItemID}|${fechaH}|${horaToma}`).join('\n');
		
		const filename = path.join(out_dir, `${fecha + Norden}.ord`);
		const data =
`H|^&|Roche^^Diagnostics|||OrderEntry^Interface||HPBO^^cobas_Infinity||||P|
P|1|${fecha}${Norden}|${req.body.IDENTIFICADOR}|${req.body.APELLIDO}|${req.body.NOMBRES}|${req.body.FECHANACIMIENTO.replaceAll('-', '')}|${req.body.SEXO}|${req.body.CODDOCTOR}|${req.body.CODTIPOORDEN}|${req.body.PRIORIDAD}|${req.body.CODCENTROSALUD}|${req.body.OPERADOR}|${req.body.CODFLEBOTOMISTA}|${req.body.CORRELATIVO}|${req.body.CODIMPRESORA}|${req.body.HIS}|${fechaH}|${horaToma}|
${idw}
L|1|F`;




		fs.writeFileSync(`${filename}`, data);  */

    if (
      (req.body.NUMEROORDEN === null && estadoPrueba === undefined) ||
      (req.body.NUMEROORDEN === "" && estadoPrueba === undefined) ||
      (!req.body.NUMEROORDEN && estadoPrueba === undefined)
    ) {
      console.warn("ESTADO PROCESADO Y GENERACION DEL NUMEROORDEN");

      const {
        HORATOMA = horaToma,
        FECHATOMA = fechaToma,
        CODIMPRESORA,
        NUMEROORDEN = fecha + Norden,
        ESTADO = 2,
      } = req.body;

      await Cabecera.update(
        { HORATOMA, FECHATOMA, CODIMPRESORA, NUMEROORDEN, ESTADO },
        { where: { id: req.body.id } },
      );

      const idw = req.body.pruebas
        .filter((e) => e.ESTADO == "1")
        .map(
          (e, i) =>
            `O|${i + 1}|${fecha}${Norden}|${e.ItemID}|${fecha}|${horaToma}`,
        )
        .join("\n");
      console.log(`****************idw***`, idw);
      const filename = path.join(out_dir, `${fecha + Norden}.ord`);
      const data = `H|^&|Roche^^Diagnostics|||OrderEntry^Interface||HPBO^^cobas_Infinity||||P|
        P|1|${fecha}${Norden}|${req.body.IDENTIFICADOR}|${req.body.APELLIDO}|${req.body.NOMBRES}|${req.body.FECHANACIMIENTO.replaceAll("-", "")}|${req.body.SEXO}|${req.body.CODDOCTOR}|${req.body.CODTIPOORDEN}|${req.body.CODSALA}|${req.body.OPERADOR}|${req.body.CODFLEBOTOMISTA}|${req.body.CORRELATIVO}|${req.body.CODIMPRESORA}|${nInfinity.HIS}|${fecha}|${horaToma}
        ${idw}
        L|1|F`;
      fs.writeFileSync(`${filename}`, data);

      res.status(201).json({
        msg: `Se a creado  la orden de Inifnity # ${fecha + Norden} con exito`,
      });
    } else if (req.body.NUMEROORDEN && estadoPrueba === undefined) {
      const { ESTADO = 2 } = req.body;

      await Cabecera.update(
        {
          ESTADO,
        },
        { where: { id: id } },
      ).then((cabecera) => {
        const idw = req.body.pruebas
          .filter((e) => e.ESTADO == "1")
          .map(
            (e, i) =>
              `O|${i + 1}|${nInfinity.NUMEROORDEN}|${e.ItemID}|${fecha}|${horaToma}`,
          )
          .join("\n");
        const filename = path.join(out_dir, `${nInfinity.NUMEROORDEN}.ord`);
        const data = `H|^&|Roche^^Diagnostics|||OrderEntry^Interface||HPBO^^cobas_Infinity||||P|
        P|1|${nInfinity.NUMEROORDEN}|${req.body.IDENTIFICADOR}|${req.body.APELLIDO}|${req.body.NOMBRES}|${req.body.FECHANACIMIENTO.replaceAll("-", "")}|${req.body.SEXO}|${req.body.CODDOCTOR}|${req.body.CODTIPOORDEN}|${req.body.CODSALA}|${req.body.OPERADOR}|${req.body.CODFLEBOTOMISTA}|${req.body.CORRELATIVO}|${req.body.CODIMPRESORA}|${nInfinity.HIS}|${fecha}|${horaToma}
        ${idw}
        L|1|F`;
        fs.writeFileSync(`${filename}`, data);

        res.status(201).json({
          msg: `Se completo la orden # ${nInfinity.NUMEROORDEN} con la muestra pendiente`,
        });
      });

      const hoy = new Date();
      const now = hoy.toLocaleDateString("en-US");
      const user = req.id;
      const hora = moment().format("LTS");
      const hor = hora.slice(0, 8);
    } else if (
      (req.body.NUMEROORDEN === null && estadoPrueba != undefined) ||
      (req.body.NUMEROORDEN === "" && estadoPrueba != undefined)
    ) {
      console.info("ESTADO 3 Y GENERACION DEL NUMEROORDEN");
      console.info("esoty en estado 333333333", Norden);
      const {
        HORATOMA = horaToma,
        FECHATOMA = fechaToma,
        CODIMPRESORA,
        NUMEROORDEN = fecha + Norden,

        ESTADO = 3,
      } = req.body;

      await Cabecera.update(
        {
          HORATOMA,
          FECHATOMA,
          CODIMPRESORA,
          NUMEROORDEN,

          ESTADO,
        },
        { where: { id: id } },
      ).then((cabecera) => {
        const idw = req.body.pruebas
          .filter((e) => e.ESTADO == "1")
          .map(
            (e, i) =>
              `O|${i + 1}|${fecha}${Norden}|${e.ItemID}|${fecha}|${horaToma}`,
          )
          .join("\n");
        console.log(`****************idw***`, idw);
        const filename = path.join(out_dir, `${fecha + Norden}.ord`);
        const data = `H|^&|Roche^^Diagnostics|||OrderEntry^Interface||HPBO^^cobas_Infinity||||P|
        P|1|${fecha}${Norden}|${req.body.IDENTIFICADOR}|${req.body.APELLIDO}|${req.body.NOMBRES}|${req.body.FECHANACIMIENTO.replaceAll("-", "")}|${req.body.SEXO}|${req.body.CODDOCTOR}|${req.body.CODTIPOORDEN}|${req.body.CODSALA}|${req.body.OPERADOR}|${req.body.CODFLEBOTOMISTA}|${req.body.CORRELATIVO}|${req.body.CODIMPRESORA}|${nInfinity.HIS}|${fecha}|${horaToma}
        ${idw}
        L|1|F`;
        fs.writeFileSync(`${filename}`, data);
        res.status(201).json({
          msg: `Se a creado  la orden de Inifnity # ${fecha + Norden} con exito`,
        });
      });
    }

    res.status(201).json({
      msg: `Se genero correctamente el ingreso de la orden del paciente ${req.body.NOMBRES} `,
    });
  } catch (error) {
    console.log(`*****************ERROR*************`, error);
  } finally {
    releaseHisMutex();
  }
};

module.exports = {
  generarhl7,
};
