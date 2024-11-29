
const axios = require("axios").default;

const localStorage = require("localStorage");
const xml2js = require("xml2js");
const stripNS = require("xml2js").processors.stripPrefix;
const { loginInfinity } = require("../helpers/loginInfinity");
const getViews = async(req ,res)=>{

    const CacheUserName = "_SYSTEM";
	const CachePassword = "INFINITY";
	const credentials = `${CacheUserName}:${CachePassword}`;
	const encodedToken = Buffer.from(credentials).toString("base64");
	const responseToken = await loginInfinity(encodedToken);

	let params = {
		soap_method: "GetResults",
		pstrSessionKey: `${responseToken}`,
		pstrOrderDateFrom: "2024-09-17",
		pstrOrderDateTo: "2024-09-17",
		pstrSuperGroupName: "HCA",
	};

	const rawcookies = localStorage.getItem("rawcookies");

	const orden = axios.create({
		baseURL: `${process.env.baseURL}/wso.ws.wResults.cls`,
		params,
		headers: { cookie: rawcookies },
	});

	const resp = await orden.get();
	const data = resp.data;

    xml2js.parseString(
		data,
		{
			explicitArray	: false,
			mergeAttrs: true,
			explicitRoot: false,
			tagNameProcessors: [stripNS],
		},
		(err, result) => {
			if (err) {
				throw err;
			}
            const datafinal =
            result.Body.GetResultsResponse.GetResultsResult.Orders.LISOrder;
            res.json(datafinal)
        }
        )

    

}

module.exports={
    getViews
}