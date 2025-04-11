const xpath = require("xpath"),
	dom = require("xmldom").DOMParser;
const { parseStringPromise } = require("xml2js");
const axios = require("axios");
const localStorage = require("localStorage");
const stripNS = require("xml2js").processors.stripPrefix;
const xml2js = require("xml2js");
const { processors } = require("xml2js");
const { wrapper } = require("axios-cookiejar-support");
const tough = require("tough-cookie");

const cookieJar = new tough.CookieJar();
let accessToken = null;
const loginInfinity = async () => {
	const credenciales = `${process.env.CacheUserName}:${process.env.CachePassword}`;
	const encodedToken = Buffer.from(credenciales).toString("base64");
	let params = {
		soap_method: `${process.env.Login}`,
		pstrUserName: `${process.env.pstrUserName}`,
		pstrPassword: `${process.env.pstrPassword}`,
		pblniPad: 0,
	};

	const client = wrapper(
		axios.create({
			baseURL: `${process.env.baseURL}/zdk.ws.wSessions.cls`,
			withCredentials: true,
			jar: cookieJar,
			params,
			headers: {
				Authorization: `Basic ${encodedToken}`,
			},
		})
	);

	const resp = await client.get();
 
	const doc = new dom().parseFromString(resp.data);
	const select = xpath.useNamespaces({
		"SOAP-ENV": "http://tempuri.org",
	});
	accessToken = select("string(//SOAP-ENV:LoginResult)", doc);
//	console.log(`*****`, accessToken);
	return accessToken;
};

const getToken = () => accessToken;
const getCookieJar = () => cookieJar;
module.exports = { loginInfinity, getToken, getCookieJar };
