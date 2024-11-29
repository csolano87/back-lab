const { config } = require("dotenv");
const { Request, Response } = require("express");
const xpath = require("xpath"),
  dom = require("xmldom").DOMParser;
const axios = require("axios").default;
const localStorage = require("localStorage");
const login = async (req, res) => {
  const token = `${process.env.CacheUserName}:${process.env.CachePassword}`;
  const encodedToken = Buffer.from(token).toString("base64");
  let params = {
    soap_method: `${process.env.Login}`,
    pstrUserName: `${process.env.pstrUserName}`,
    pstrPassword: `${process.env.pstrPassword}`,
    pblniPad: 0,
  };
  /* const CacheUserName = '_SYSTEM'
    const CachePassword = 'INFINITY' */

  const instance = axios.create({
    baseURL: `http://192.168.1.2/csp/acb/zdk.ws.wSessions.cls`,
    params,
    headers: { Authorization: `Basic ${encodedToken}` },
  });
  // axios.defaults.baseURL=`http://192.168.1.2/csp/acb/zdk.ws.wSessions.cls`
  //console.log(instance)

  instance.interceptors.request.use((request) => {
    // request.headers.Authorization = `Basic ${encodedToken}`;

    //console.log(request)
    //console.log(instance)

    return request;
  });

  /* axios.interceptors.request.use((config) =>{
          const psrttokenID = localStorage.getItem('psrttoken');
          if (psrttokenID) 
            config.headers.Authorization=`Basic ${encodedToken}`;
            return config;
          }, error=>{
            return Promise.reject(error)
          
         
         

        })   */

  /*        const resp= await instance.post();
       
        const rawcookies=resp.headers['set-cookie']
  
        localStorage.setItem('rawcookies',rawcookies);
         const  doc = new dom().parseFromString(resp.data);       
        const select  = xpath.useNamespaces({'SOAP-ENV':'http://tempuri.org'})
        const Idtoken = select('string(//SOAP-ENV:LoginResult)', doc);
        res.status(200).json({ok:Idtoken})
        localStorage.setItem('Idtoken', Idtoken); 
        console.log(resp)
        */
};

module.exports = { login };
