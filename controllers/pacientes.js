const { Request, Response } = require("express");
const xpath = require("xpath"),
  dom = require("xmldom").DOMParser;
const axios = require("axios").default;
const localStorage = require("localStorage");
const { loginInfinity } = require("../helpers/loginInfinity");

const xml2js = require("xml2js");
const fs = require("fs");

const stripNS = require("xml2js").processors.stripPrefix;
//const parser = new xml2js.Parser({ attrkey: "ATTR" });
const pacientes = async (req, res) => {
  const { IDENTIFICADOR, CEDULA } = req.query;
  console.log("IDENTIFICADOR", IDENTIFICADOR);
  console.log("CEDULA", CEDULA);
  const CacheUserName = `${process.env.CacheUserName}`;
  const CachePassword = `${process.env.CachePassword}`;
  const token = `${CacheUserName}:${CachePassword}`;
  const encodedToken = Buffer.from(token).toString("base64");

  const responseToken = await loginInfinity(encodedToken);
  localStorage.setItem("Idtoken", responseToken);
  const tokenResult = localStorage.getItem("Idtoken");
  const rawcookies = localStorage.getItem("rawcookies");
  /*  const token=  localStorage.getItem('Idtoken')
   
   const rawcookies=localStorage.getItem('rawcookies'); */
  let params = {
    soap_method: `${process.env.Ordenes}`,
    pstrSessionKey: `${tokenResult}`,
    pstrPatientID1: `${CEDULA}`,

    pstrFirstName: ``,
    pstrLastName: `${IDENTIFICADOR}`,
  };
  try {
    const intance = axios.create({
      /*baseURL: `${process.env.baseURL}/wso.ws.wPatients.cls?soap_method=GetList&pstrSessionKey=${token}&pstrPatientID1=${cedula}&pstrPatientID2=&pstrPatientID3=&pstrFirstName=&pstrLastName=&pstrSeconSurname=&pstrSurNameAndName=&pintAgeUnit=0&pintAgeFrom=&pintAgeTo=&pstrBirthdateFrom=&pstrBirthdateTo=&pstrSex=`,*/

      baseURL: `${process.env.baseURL}/wso.ws.wPatients.cls`,
      params,
      headers: { cookie: rawcookies },
    });

    const resp = await intance.get();
    //console.log(`*******************PACIENTES********************`,resp.data)
    //console.log(resp.headers['content-length'])
    localStorage.setItem("hora", resp.headers["content-length"]);
    //console.log('data',resp.headers['content-length'])
    const data = localStorage.getItem("hora");
    //console.log('return',data)
    const path = `${resp.data}`;

    xml2js.parseString(
      path,
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

        const pacientes =
          result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet.SQL;

        if (Array.isArray(pacientes) == true) {
          res.status(200).json({ ok: true, listaordenes: pacientes });
        } else {
          let listaArray = [];
          listaArray.push(pacientes);

          res.status(200).json({ ok: true, listaordenes: listaArray });
        }
      },
    );
  } catch (error) {
    /*  console.log('ERROR DE PACIENTES ', error)
    localStorage.removeItem('Idtoken');
    pacientes(req, res); */
  }
};

module.exports = { pacientes };
