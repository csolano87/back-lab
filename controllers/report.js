const express = require("express");
const { Request, Response } = require("express");
const Cabecera = require("../models/cabecera");
const localStorage = require("localStorage");
const axios = require("axios").default;
const xml2js = require("xml2js");
const fs = require("fs");
const appt = express();
const { loginInfinity } = require("../helpers/loginInfinity");
const { key } = require("localStorage");
const stripNS = require("xml2js").processors.stripPrefix;
const login = require("./login");
const { CLIENT_RENEG_LIMIT } = require("tls");
const { Console } = require("console");
const { string } = require("i/lib/util");

const getregistro = async (req, res) => {
  const { FECHADESDE, FECHAHASTA } = req.query;

  console.log("FECHADESDE", FECHADESDE);
  console.log("FECHAHASTA", FECHAHASTA);

  //const nuevafechadesde= FECHADESDE.split('-')

  //const nuevafechahasta= FECHAHASTA.split('-')

  /* 

    const csvFilePath = 'pruebasLIST.csv';

    // Lee el archivo CSV
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // Parsea el contenido CSV
    const parsedData = Papa.parse(fileContent, { header: true });
    
    // Obtén los datos como un array de objetos
    
   

    const data = parsedData.data;
    const jsonData = JSON.stringify(data);
    fs.writeFileSync('array.json', jsonData,{
      encoding: "utf8",
      flag: "a",
      mode: 0o666
    },) 
 */

  const CacheUserName = "_SYSTEM";
  const CachePassword = "INFINITY";
  const credentials = `${CacheUserName}:${CachePassword}`;
  const encodedToken = Buffer.from(credentials).toString("base64");
  const responseToken = await loginInfinity(encodedToken);

  let params = {
    soap_method: "GetList",

    pstrSessionKey: `${responseToken}`,
    pstrSuperGroupName: `IMPRESION`,

    pstrRegisterDateFrom: `${FECHADESDE}`,
    pstrRegisterDateTo: `${FECHAHASTA}`,
  };

  const rawcookies = localStorage.getItem("rawcookies");

  const orden = axios.create({
    baseURL: `${process.env.baseURL}/wso.ws.wOrders.cls`,
    params,

    headers: { cookie: rawcookies },
  });

  const resp = await orden.get();

  xml2js.parseString(
    resp.data,
    {
      explicitArray: false,
      mergeAttrs: true,
      explicitRoot: false,
      tagNameProcessors: [stripNS],
    },
    (err, result) => {
      if (err) {
        throw err;
      }

      const listaorden =
        result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet.SQL;

      arrayJson = [
        {
          GruposInfinity: "HECES",
          GruposMSP: "H (Heces)",
        },
        {
          GruposInfinity: "BIOLOGÍA MOLECULAR",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "ESTUDIOS ESPECIALES",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "LIQUIDOS",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "EXAMEN DE ORINA",
          GruposMSP: "O (Orina)",
        },
        {
          GruposInfinity: "QUIMICA CLINICA",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "HEMATOLOGIA",
          GruposMSP: "H(hematologia)",
        },
        {
          GruposInfinity: "COAGULACION",
          GruposMSP: "C (Cuagulación)",
        },
        {
          GruposInfinity: "MEDICINA TRANSFUCIONAL",
          GruposMSP: "H(hematologia)",
        },
        {
          GruposInfinity: "SEROLOGICAS",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "HORMONAL",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "INMUNOQUIMICA",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "GASES VENOSOS",
          GruposMSP: "G (gasometría)",
        },
        {
          GruposInfinity: "GASES ARTERIALES",
          GruposMSP: "G (gasometría)",
        },
        {
          GruposInfinity: "UCI",
          GruposMSP: "G (gasometría)",
        },
        {
          GruposInfinity: "TAMIZAJE NEONATAL",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "ALERGIAS",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "COVID - 19",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "GRUPO SANGUINEO",
          GruposMSP: "H(hematologia)",
        },
        {
          GruposInfinity: "MICOBACTERIAS",
          GruposMSP: "BAC (Bacteriologia)",
        },
        {
          GruposInfinity: "ELECTROLITOS",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "PRUEBAS VIRALES",
          GruposMSP: "IQS (Inmuno Química Serología)",
        },
        {
          GruposInfinity: "ENFERMEDADES INFECCIOSAS",
          GruposMSP: "PRUEBA DE CAMBIO DE GRUPO",
        },
      ];

      listaorden.forEach((objeto) => {
        if (objeto.Groups) {
          const GroupsArray = objeto.Groups.split(",");

          const GroupsList = GroupsArray.map((item) => {
            const referenciaObjeto = arrayJson.find(
              (ref) => ref.GruposInfinity === item,
            );

            if (referenciaObjeto) {
              return referenciaObjeto.GruposMSP;
            }
            return item;
          });

          objeto.Groups = GroupsList;
        }
      });
      res.status(200).json({ ok: true, listaordenes: listaorden });
    },
  );
};

module.exports = { getregistro };
