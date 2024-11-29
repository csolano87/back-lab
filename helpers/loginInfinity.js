const xpath = require("xpath"),
  dom = require("xmldom").DOMParser;

const axios = require("axios");
const localStorage = require("localStorage");

const loginInfinity = async (encodedToken) => {
  const tokenResult = localStorage.getItem("Idtoken");
  console.log("tokenresult", tokenResult);

  if (tokenResult == undefined || tokenResult == "" || tokenResult == null) {
    console.log("LLAMANDO AL SERVICIO LOGIN ......");
    return new Promise(async (resolve, reject) => {
      let params = {
        soap_method: `${process.env.Login}`,
        pstrUserName: `${process.env.pstrUserName}`,
        pstrPassword: `${process.env.pstrPassword}`,
        pblniPad: 0,
      };

      try {
        const intanc = axios.create({
          baseURL: `${process.env.baseURL}/zdk.ws.wSessions.cls`,
          params,
          headers: { Authorization: `Basic ${encodedToken}` },
        });

        const resp = await intanc.get();
        //console.log(resp.headers['content-length'])
        const rawcookies = resp.headers["set-cookie"];
        const expirationDate = new Date(resp.headers.expires);
        console.log(`**********EXPIRATE-LOGIN********`, expirationDate);
        localStorage.setItem("rawcookies", rawcookies);
        const doc = new dom().parseFromString(resp.data);
        const select = xpath.useNamespaces({
          "SOAP-ENV": "http://tempuri.org",
        });
        const sn = select("string(//SOAP-ENV:LoginResult)", doc);
        const token = localStorage.setItem("sn", sn);
        console.log("campo LoginResult:", sn);

        resolve(sn);
      } catch (error) {
        console.log("ERROR DE LOGIN ", error);
      }
    });
  }
  console.log("NOOOOOO LLAMANDO AL SERVICIO LOGIN ......");
  return tokenResult;
};
module.exports = { loginInfinity };
