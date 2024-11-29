/* const { Request, Response } = require("express");
const { Op, and, Sequelize, MACADDR } = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const bcryptjs = require("bcryptjs");
const { Mutex } = require("async-mutex");

const path = require("path");
const { where } = require("sequelize");
const { sequelize } = require("../models/cabecera");
const db = require("../db/connection");
const Usuario = require("../models/usuarios");
const Cabecera_Agen = require("../models/cabecera_agen");
const Detalle_Agen = require("../models/detalle_agen");
const axios = require("axios").default;
const hisMutex = new Mutex();

const Papa = require("papaparse");

const express = require("express");
const readline = require("readline");

const url = require("url");

const port = 4250;

const http = require("http");
http.createServer().listen(port);

const xml2js = require("xml2js");
const stripNS = require("xml2js").processors.stripPrefix;

const localStorage = require("localStorage");

const { resolve } = require("path");
const { config, mainModule } = require("process");
const carpetaleidos = String.raw`C:\procesados`;
const out_dir = String.raw`C:\Users\devel\Desktop\readfiletemp`;

const { get } = require("https");

const { promisify } = require("util");
const factor = require("../factor");
const { loginInfinity } = require("../helpers/loginInfinity");

const parseString = promisify(xml2js.parseString);

const ordenT = async (req, res) => {
  const isRunning = false;
  const initialDate = new Date().toLocaleString("en-CO", {
    timeZone: "America/Bogota",
  });
  let temp = new Date(initialDate);
  console.log("temap", temp);
  let ant = 5 * 86399.9; //dias en segundos

  let finalDate = new Date(temp.setSeconds(-ant));
  let vtg = finalDate.toLocaleString().slice(0, 9);
  let fehta = vtg.split("/");

  const getOrden = async () => {
    return new Promise(async (resolve, reject) => {
      const CacheUserName = "_SYSTEM";
      const CachePassword = "INFINITY";
      const credentials = `${CacheUserName}:${CachePassword}`;
      const encodedToken = Buffer.from(credentials).toString("base64");
      const responseToken = await loginInfinity(encodedToken);

      const fechaCortada = initialDate
        .slice(0, 10)
        .replaceAll("/", "-")
        .replaceAll(",", "")
        .trim();
      let feha = fechaCortada.split("-");

      let payload = {
        soap_method: "GetResults",
        pstrSessionKey: `${responseToken}`,
        pstrOrderDateFrom: `2023-08-28`,
        pstrOrderDateTo: `2023-08-28`,
        pintMinStatusTest: 3,
      };
      const params = new url.URLSearchParams(payload);
      console.log("show params 22>> ", params);
      const rawcookies = localStorage.getItem("rawcookies");

      const orden = axios.create({
        baseURL: ` http://192.168.11.75/csp/acb/wso.ws.wResults.cls?${params}`,
        headers: { cookie: rawcookies },
      });
      const res = await orden.get();
      const xmlResult = await parseString(res.data, {
        explicitArray: false,
        mergeAttrs: true,
        explicitRoot: false,
        tagNameProcessors: [stripNS],
      });

      // console.log(`*****************************`,result.Body.GetResultsResponse.GetResultsResult.Orders.LISOrder)
      const listaorden =
        xmlResult.Body.GetResultsResponse.GetResultsResult.Orders.LISOrder;

      if (Array.isArray(listaorden) == true) {
        const numerosDeOrden = listaorden.map((orden) => orden.SampleID);
        const pacientesEncontrados = await Cabecera_Agen.findAll({
          where: { NUMEROORDEN: numerosDeOrden, ESTADO: 2 },
        });

        const numerosOrdenEncontrados = pacientesEncontrados.map(
          (paciente) => paciente.NUMEROORDEN,
        );

        const listaOrdenFiltrada = listaorden.filter(
          (orden) => !numerosOrdenEncontrados.includes(orden.SampleID),
        );
        resolve(listaOrdenFiltrada);
      } else {
        let nListaorden = [];
        nListaorden.push(listaorden);
        //console.log(`*******o4***`,nListaorden)
        const numerosDeOrden = nListaorden.map((orden) => orden.SampleID);
        console.log(`*******o45***`, numerosDeOrden[0]);

        const pacientesEncontrados = await Cabecera_Agen.findOne({
          where: { NUMEROORDEN: numerosDeOrden[0], ESTADO: 2 },
        });
        console.log(`estoy aqui`, pacientesEncontrados);
        const listaOrdenFiltrada = nListaorden.filter(
          (orden) => orden.SampleID !== pacientesEncontrados,
        );
        const listaOrdenConHIS = listaOrdenFiltrada.map((orden) => ({
          ...orden,
          HIS: pacientesEncontrados.dataValues.HIS,
        }));

        console.log(`*******o45r***`, listaOrdenConHIS);
        if (listaOrdenConHIS.length > 0) {
          resolve(listaOrdenConHIS);
        } else {
          console.log("NO TIENE ORDENES GENERADAS EN EL DIA DE HOY");
        }
      }
    });
  };

  getOrden().then((cedula) => {
    const results = [];
    //res.json({cedula})
    cedula.forEach((report) => {
      const SampleID = report.SampleID;
      const labTests = report.LabTests.LISLabTest;

      if (Array.isArray(labTests)) {
        labTests.forEach(async (test) => {
          const testID = test.TestID;
          const valueResult = test.LabResults.LISLabResult.ValueResult;
          const matchingFact = factor.find(
            (item) => item.id === Number(testID),
          );
          if (matchingFact) {
            const fact_id = matchingFact.fact_id;
            const tipo_exam_id = matchingFact.tipo_exam_id;
            const pacientesEncontrado = await Cabecera_Agen.findOne({
              where: { NUMEROORDEN: SampleID, ESTADO: 2 },
              include: {
                model: Detalle_Agen,
                as: "as400",
              },
            });
            if (pacientesEncontrado) {
              // Buscar el detalle en 'pacientesEncontrado' que coincide con tipo_exam_id
              const matchingDetalle = pacientesEncontrado.as400.find(
                (detalle) => detalle.ItemID === tipo_exam_id,
              );

              if (matchingDetalle) {
                const exam_id = matchingDetalle.exam_id;

                results.push({
                  SampleID,
                  testID,
                  tipo_exam_id,
                  exam_id,
                  fact_id,
                  valueResult,
                });
                // results.push({ SampleID, TestID: testID, ValueResult: valueResult });
              }
            }
          }
        });
      } else {
        const testID = labTests.TestID;
        const valueResult = labTests.LabResults.LISLabResult.ValueResult;

        results.push({ SampleID, TestID: testID, ValueResult: valueResult });
      }
    });

    results.forEach((item) => {
      const matchingFactor = factor.find(
        (factorItem) => factorItem.id === item.TestID,
      );

      if (matchingFactor) {
        item.fact_id = matchingFactor.fact_id;
      }
    });

    res.json(results);
  });


};

module.exports = { ordenT };
 */