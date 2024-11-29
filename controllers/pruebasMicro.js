const express = require("express");
const { Request, Response } = require("express");
const Cabecera = require("../models/cabecera");

const axios = require("axios").default;

const fs = require("fs");
const appt = express();
const { loginInfinity } = require("../helpers/loginInfinity");
const { key } = require("localStorage");
const localStorage = require("localStorage");
const xml2js = require("xml2js");
const stripNS = require("xml2js").processors.stripPrefix;
const login = require("../controllers/login");
const { CLIENT_RENEG_LIMIT } = require("tls");
const { Console } = require("console");
const { string } = require("i/lib/util");

const pruebasMicro = async (req, res) => {
  const { q } = req.params;
  console.log("termino", q);

  const CacheUserName = `${process.env.CacheUserName}`;
  const CachePassword = `${process.env.CachePassword}`;
  const token = `${CacheUserName}:${CachePassword}`;
  const encodedToken = Buffer.from(token).toString("base64");

  const responseToken = await loginInfinity(encodedToken);
  localStorage.setItem("Idtoken", responseToken);
  const tokenResult = localStorage.getItem("Idtoken");
  const rawcookies = localStorage.getItem("rawcookies");
  let params = {
    soap_method: "GetList",
    pstrSessionKey: `${tokenResult}`,
    pintMicroType: 1,
    pintStatus: 1,
    pstrTestName: `${q}`,
  };

  const instance = axios.create({
    baseURL: `${process.env.baseURL}/wso.ws.wTests.cls`,
    params,
    headers: { cookie: rawcookies },
  });
  const resp = await instance.get();
  //console.log(`*******************TESTS****************`,resp.data)
  //res.status(200).json({ok:true,prueba:resp.data})
  try {
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

        // console.log(`*******************TESTS****************`,result)
        let listapruebas =
          result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet.SQL;

        /* const pruebaFilter=listapruebas.filter((e)=>e.Tipo==0) */

        res.status(200).json({ ok: true, prueba: listapruebas });
        //console.log(listapruebas)
      },
    );
  } catch (error) {}
};
module.exports = { pruebasMicro };
