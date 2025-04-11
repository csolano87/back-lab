//const { response } = require("../response.json");
const moment = require("moment");
moment.locale("es");
const localStorage = require("localStorage");
const axios = require("axios").default;
const xml2js = require("xml2js");
//const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fs = require("fs");
const path = require("path");
const out_dir = String.raw`C:\Users\devel\Videos`;
const { loginInfinity, getCookieJar } = require("../helpers/loginInfinity");
const { sample, chunk } = require("lodash");
const xmlparser = require("express-xml-bodyparser");
const { writer } = require("repl");

const { Op } = require("sequelize");
const { axiosClient } = require("../helpers/axiosClient");
const { response } = require("express");
const stripNS = require("xml2js").processors.stripPrefix;
const { wrapper } = require("axios-cookiejar-support");
const tough = require("tough-cookie");
const getResultsOrders = async (req, res) => {
	const filePath = path.join(__dirname, "../response.json");
	const data = fs.readFileSync(filePath, "utf-8");
	const response = JSON.parse(data);

	res.status(200).json({ ok: true, results: response });
};

const getResultsSex = async (req, res) => {
	const filePath = path.join(__dirname, "../data.json");
	const data = fs.readFileSync(filePath, "utf-8");
	const response = JSON.parse(data);

	res.status(200).json({ ok: true, results: response });
};

const getOrders = async (req, res) => {
	const { fechaIn } = req.query;
	const num=`${fechaIn}`.replaceAll('-','').slice(2)
	const now = moment();
/* 	const pruebasEspeciales = await pruebasEspeciales.findAll({
		where: {
			numero: {
				[Op.like]: `${num}%`,
			},
		},
	}); */


	const fecha = now.format("YYYY-MM-DDHH:mm:ss");

	const getResult = async () => {
		return new Promise(async (resolve, reject) => {
			const codigoId = ["2047", "7072", "2002"];
			let params = {
				soap_method: "GetResults",				
				pstrOrderDateFrom: `${fechaIn}`,
				pstrOrderDateTo: `${fechaIn}`,
				plstTestsList: "2047,7072,2002",
			};
			const resp = await axiosClient.get("/wso.ws.wResults.cls", { params });
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
					const lista =
						result.Body.GetResultsResponse.GetResultsResult?.Orders.LISOrder;
					const results = Array.isArray(lista) ? lista : [lista];
				
					const filtroOrdens = results.filter(
						(item) => item?.MotiveDesc != "RUTINA"
					);
					/* 	filtroOrdens = filtroOrdens.filter(
						(it) =>
							it.SampleID == pruebasEspeciales.numero &&
							pruebasEspeciales.estado != "true"
					); */
					resolve(filtroOrdens);
				}
			);
		});
	};

	const getOrden = async (sampleID) => {
		return new Promise(async (resolve, reject) => {
			let params = {
				soap_method: "GetList",
				pstrSampleID: `${sampleID}`,
			};
			const resp = await axiosClient.get("/wso.ws.wOrders.cls", { params });
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
						console.log(`err`, err);
						throw err;
					}
					const listaorden =
						result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet
							.SQL;
					resolve(listaorden);
				}
			);
		});
	};

	try {
		const resultsOrden = await getResult();
		const detalles = await Promise.all(
			resultsOrden.map(async (element) => {
			/* 	const estadoM = pruebasEspeciales.find(
					(item) => item.numero === element.SampleID
				); */
				const data = await getOrden(element.SampleID);
				const LISLabTests = Array.isArray(element.LabTests.LISLabTest)
					? element.LabTests.LISLabTest
					: [element.LabTests.LISLabTest];
				return {
					numeroroden: data.SampleID,
					nombres: data.SurNameAndName,
					origenOrden: data.Motive,
					origenResult: element.OriginDesc,
					numeroResults: element.SampleID,
					prueba: LISLabTests.map((test) => ({
						TestID: test.TestID,
						TestName: test.TestName,
					})),
					validator: data.IsOrderValidated,
					estadoMail: estadoM ? estadoM : "",
				};
			})
		);

		res.json({
			ok: true,
			pruebaEspecial: detalles,
		});
	} catch (error) {
		console.error("Error al obtener los datos:", error);
	}
};


const getOrdenesInfinity= async (req,res)=>{
	const { fechaIn,fechaOut} = req.query;
	const getResult = async () => {
		return new Promise(async (resolve, reject) => {
		const filePath = path.join(__dirname, "../resp.xml");
		const data = fs.readFileSync(filePath, "utf-8");
		xml2js.parseString(
			data,
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
				const lista =
					result.Body.GetResultsResponse.GetResultsResult?.Orders.LISOrder;
				const results = Array.isArray(lista) ? lista : [lista];
			
				const filtroOrdens = results.filter(
					(item) => item?.Origin == 9
				);
			
				resolve(filtroOrdens);
			}
		);
	});

	/* 	return new Promise(async (resolve, reject) => {
			
			let params = {
				soap_method: "GetResults",				
				pstrOrderDateFrom: `${fechaIn}`,
				pstrOrderDateTo: `${fechaOut}`,
				plstTestsList: "3001,3009,3017,3019,3023,3025,3027,3029,3031,3033,3035,3037,3056,3071,3077,3079,3081,3083,3085,3087,3089,3145,3148,3201,3205,3210,3220,3225,3230,3235,3240,3245,3247,3304,3309,3312,3315,3318,3321,3324,3327,3333,3348,3349,3355,3358,3373,3465,3554,3589,3706,3727,3778 ",
			};
			const resp = await axiosClient.get("/wso.ws.wResults.cls", { params });
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
					const lista =
						result.Body.GetResultsResponse.GetResultsResult?.Orders.LISOrder;
					const results = Array.isArray(lista) ? lista : [lista];
				
					const filtroOrdens = results.filter(
						(item) => item?.Origin == 9
					);
				
					resolve(filtroOrdens);
				}
			);
		}); */
	};

	const getOrden = async (sampleID) => {
		return new Promise(async (resolve, reject) => {
			let params = {
				soap_method: "GetList",
				pstrSampleID: `${sampleID}`,
			};
			const resp = await axiosClient.get("/wso.ws.wOrders.cls", { params });
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
						console.log(`err`, err);
						throw err;
					}
					const listaorden =
						result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet
							.SQL;
					resolve(listaorden);
				}
			);
		});
	};

	try {
		const resultsOrden = await getResult();
		const detalles = await Promise.all(
			resultsOrden.map(async (element) => {
			
			//	const data = await getOrden(element.SampleID);
				const LISLabTests = Array.isArray(element.LabTests.LISLabTest)
					? element.LabTests.LISLabTest
					: [element.LabTests.LISLabTest];
				return {
					numeroroden: element.SampleID,
					nombres: '',
					doctor:element.Doctor,
					origenOrden: element.OriginDesc,
					//origenResult: element.OriginDesc,
					//numeroResults: element.SampleID,
					prueba: LISLabTests.map((test) => ({
						TestID: test.TestID,
						TestName: test.TestName,
					})),
					/* validator: data.IsOrderValidated,
					estadoMail: estadoM ? estadoM : "", */
				};
			})
		);

		res.json({
			ok: true,
			ordenInfinity: detalles,
		});
	} catch (error) {
		console.error("Error al obtener los datos:", error);
	}

}
module.exports = { getResultsOrders, getOrders, getResultsSex ,getOrdenesInfinity};
