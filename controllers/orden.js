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

const orden = async (req, res) => {
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
    pstrDemographicCode: "OR_ORIGIN",
    pstrDemographicName: "",
    pstrValueCode: "",
    pstrDescription: "",
    pintStatus: 1,
  };

  try {
    const instance = axios.create({
      baseURL: `${process.env.baseURL}/wso.ws.wDemographicValues.cls`,
      params,
      headers: { cookie: rawcookies },
    });

    const resp = await instance.get();

    //console.log('ordenes',resp.headers['content-length'])

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

        res.status(200).json({ ok: true, orden: listaorden });
      },
    );
  } catch (error) {
    console.log("---- line 147777777");

    localStorage.removeItem("Idtoken");
    orden(req, res);
  }
};
module.exports = { orden };
