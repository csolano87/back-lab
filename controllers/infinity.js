const express = require("express");
const axios = require("axios");
const sessionstorage = require("sessionstorage");
const localStorage = require("localStorage");
const cookieParser = require("cookie-parser");
const xpath = require("xpath"),
  dom = require("xmldom").DOMParser;
const Cabecera = require("../models/cabecera");
const request = require("request");

const appt = express();
const { loginInfinity } = require("../helpers/loginInfinity");
const { BindingElement } = require("soap/lib/wsdl/elements");
const { BasicAuthSecurity } = require("soap");
const { send } = require("process");
const { cookie } = require("request");
const stripNS = require("xml2js").processors.stripPrefix;
const xml2js = require("xml2js");
const erGet = async (req, res) => {
  const { NUMEROORDEN } = req.params;

  const substringcode = NUMEROORDEN.substring(0, 6);
  const anio = substringcode.substring(0, 2);
  const mes = substringcode.substring(2, 4);
  const dia = substringcode.substring(4, 6);
  const newCode = anio + "-" + mes + "-" + dia;
  const concatAnio = "20" + newCode;
  const date = concatAnio;
  //const description = 'FINAL';
  const description = "FINAL";
  const rawcookie = localStorage.getItem("rawcookies");
  const tokenID = localStorage.getItem("Idtoken");
  const params = {
    soap_method: `${process.env.Reporte}`,
    pstrSessionKey: `${tokenID}`,
    pstrSampleID: `${NUMEROORDEN}`,
    pstrRegisterDate: `${date}`,
    pstrFormatDescription: `${description}`,
    pstrPrintTarget: `${process.env.Target}`,
  };

  try {
    const instance = axios.create({
      baseURL: `${process.env.baseURL}/wso.ws.wReports.cls`,
      params,
      headers: { cookie: rawcookie },
    });
    const response = await instance.get();

    console.log("status code :: ", response.status);
    console.log(response.data);

    xml2js.parseString(
      response.data,
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

        const pdf = result.Body.PreviewResponse.PreviewResult;
        console.log(pdf);

        if (pdf != undefined) {
          //const report=pdf.replace('http://172.31.1.8','http://104.209.211.243')
          const report = pdf.replace("localhost", "172.16.197.209");
          console.log(report);
          res
            .status(200)
            .json({
              success: true,
              status_server: response.status,
              pdf: report,
            });
        } else {
          res
            .status(400)
            .json({
              success: false,
              pdf: "El numero de orden que ingresaste no es correcto verifica la orden y vuleve a intentar..",
            });
        }
      },
    );
  } catch (error) {
    res.status(404).json({ success: false, error: error });
  }
};

module.exports = { erGet };
