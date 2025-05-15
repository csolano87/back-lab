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
const csvToJson = require("convert-csv-to-json");
const { Op } = require("sequelize");
const { axiosClient } = require("../helpers/axiosClient");
const { response } = require("express");
const stripNS = require("xml2js").processors.stripPrefix;
const { wrapper } = require("axios-cookiejar-support");
const tough = require("tough-cookie");
const excelToJson = require("convert-excel-to-json");
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
	const num = `${fechaIn}`.replaceAll("-", "").slice(2);
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
		console.log(`resultsOrden`, resultsOrden);
		if (resultsOrden && resultsOrden[0] !== undefined) {
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
						//estadoMail: estadoM ? estadoM : "",
					};
				})
			);

			res.json({
				ok: true,
				pruebaEspecial: detalles,
			});
		} else {
			res.json({
				ok: true,
				msg: `No existe ordenes `,
			});
		}
	} catch (error) {
		console.error("Error al obtener los datos:", error);
	}
};

const getOrdenesInfinity = async (req, res) => {
	const { fechaIn, fechaOut } = req.query;
	console.log(fechaIn, fechaOut);

	const startDate = new Date(fechaIn);
	const endDate = new Date(fechaOut);
	progress = 0;
	let responseData = [];
	const getResult = async () => {
		return new Promise(async (resolve, reject) => {
			/* 	const filePath = path.join(__dirname, "../resp.xml");
				const data = fs.readFileSync(filePath, "utf-8"); */

			const bucleRequest = async (date) => {
				let params = {
					soap_method: "GetResults",
					pstrOrderDateFrom: date.toISOString(),
					pstrOrderDateTo: date.toISOString(),
					plstTestsList:
						"3001,3009,3017,3019,3023,3025,3027,3029,3031,3033,3035,3037,3056,3071,3077,3079,3081,3083,3085,3087,3089,3145,3148,3201,3205,3210,3220,3225,3230,3235,3240,3245,3247,3304,3309,3312,3315,3318,3321,3324,3327,3333,3348,3349,3355,3358,3373,3465,3554,3589,3706,3727,3778",
				};
				const resp = await axiosClient.get("/wso.ws.wResults.cls", { params });
				//console.log(resp.data);
				responseData.push(resp.data);
			};
			for (
				let date = startDate;
				date < endDate;
				date.setDate(date.getDate() + 1)
			) {
				await bucleRequest(date);
			}
			const parser = new xml2js.Parser({
				explicitArray: false,
				mergeAttrs: false,
				explicitRoot: false,
				ignoreAttrs: true,

				tagNameProcessors: [stripNS],
			});

			const parsedData = await Promise.all(
				responseData.map((xml) => {
					return new Promise((resolve, reject) => {
						parser.parseString(xml, (err, result) => {
							if (err) reject(err);
							else resolve(result);
						});
					});
				})
			);

			// Unimos todos los LISOrder encontrados
			const lista = [];

			parsedData.forEach((data) => {
				const orders =
					data?.Body?.GetResultsResponse?.GetResultsResult?.Orders?.LISOrder;

				if (Array.isArray(orders)) {
					lista.push(...orders);
				} else if (orders) {
					lista.push(orders); // si es solo un objeto
				}
			});

			const results = Array.isArray(lista) ? lista : [lista];

			const filtroOrdens = results.filter((item) => item?.Origin == 9);

			resolve(filtroOrdens);
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
				console.log(`Ordenes `, element.SampleID);
				const data = await getOrden(element.SampleID);
				console.log(`DATA `, data);
				const LISLabTests = Array.isArray(element.LabTests.LISLabTest)
					? element.LabTests.LISLabTest
					: [element.LabTests.LISLabTest];

				const pruebasSinResultado = LISLabTests.map((test) => {
					const resultado = test?.LabResults?.LISLabResult?.ValueResult || "";
					return {
						TestID: test.TestID,
						TestABREV: test.TestAbbreviation,
						TestName: test.TestName,
						TestResult: resultado,
					};
				});
				/* .filter((test) => test.TestResult === ""); */ // Solo los vacíos

				// Si no hay pruebas sin resultado, no devolvemos nada
				if (pruebasSinResultado.length === 0) return null;

				return {
					numeroroden: element.SampleID,
					nombres: data.SurNameAndName,
					sexo: data.Sex,
					fechanac: data.DateOfBirth,
					edad: data.Age,
					histClinic: data.PatientID1,
					doctor: element.Doctor,
					origenOrden: element.OriginDesc,
					prueba: pruebasSinResultado,
				};
			})
		);

		// Filtramos las órdenes que sí tienen pruebas sin resultado
		const ordenesPendientes = detalles.filter((orden) => orden !== null);

		res.json({
			ok: true,
			ordenInfinity: ordenesPendientes,
		});
	} catch (error) {
		console.error("Error al obtener los datos:", error);
	}
};

const getOrdenesProcedencia = async (req, res) => {
	const { fechaIn, fechaOut } = req.query;
	console.log(fechaIn, fechaOut);
	const getResult = async () => {
		return new Promise(async (resolve, reject) => {
			let params = {
				soap_method: "GetResults",
				pstrOrderDateFrom: `${fechaIn}`,
				pstrOrderDateTo: `${fechaOut}`,
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

					const filtroOrdens = results.filter((item) => item?.Origin == 9);

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
				pstrPatientID1: `${sampleID}`,
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
	const getPacientes = async () => {
		return new Promise(async (resolve, reject) => {
			let params = {
				soap_method: "GetList",
			};
			const resp = await axiosClient.get("/wso.ws.wPatients.cls", { params });
			console.log(`URL DE PACIENTE`, resp);
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
					const lista =
						result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet
							.SQL;

					const listaPaciente = lista.filter((item) => item.D_110 == cedula);
					resolve(listaPaciente);
				}
			);
		});
	};
	try {
		const resultPaciente = await getPacientes();
		//const resultsOrden = await getResult();
		const detalles = await Promise.all(
			resultPaciente.map(async (element) => {
				const data = await getOrden(element.PA_ID1);

				return {
					cedula: element.D_101,
					register: data.RegisterDate,
					numeroroden: element.SampleID,
					nombres: data.SurNameAndName,
					sexo: data.Sex,
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
};

const getPacientes = async (req, res) => {
	const getPaciente = async () => {
		if (!req.file) {
			return res.status(400).json({ ok: false, msg: `No existe archivo` });
		}

		let fileInputName = req.file.path;
		const json = excelToJson({
			sourceFile: fileInputName,
			columnToKey: {
				//A: 'id',
				B: "cedula",
			},
		});

		const sheetNames = Object.keys(json);

		console.log("Hojas:", sheetNames);
		console.log(`excel conversion a json`, json);

		return new Promise(async (resolve, reject) => {
			let params = {
				soap_method: "GetList",
			};
			const resp = await axiosClient.get("/wso.ws.wPatients.cls", { params });

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
					const lista =
						result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet
							.SQL;
					console.log(`API LISTA--`, lista);
					const listaPaciente = lista.filter((item) =>
						json.Hoja2.some(
							(element) =>
								element.cedula.length === 10
									? element.cedula
									: 0 + "" + element.cedula === item.D_110 //D_101
						)
					);
					console.table(`PACIENTE`, listaPaciente);
					resolve(listaPaciente);
				}
			);
		});
	};
	const getOrden = async (sampleID) => {
		return new Promise(async (resolve, reject) => {
			let params = {
				soap_method: "GetList",
				pstrPatientID1: `${sampleID}`,
				//pstrPatientID1
			};
			const resp = await axiosClient.get("/wso.ws.wOrders.cls", { params });
			console.log(`API ORDENES1`, resp);
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
					//	console.table(`ORDENES`, listaorden);
					resolve(listaorden);
				}
			);
		});
	};
	const getResult = async (numero) => {
		if (numero) {
			return new Promise(async (resolve, reject) => {
				const fecha = 20 + "" + numero.slice(0, 6);
				console.log(`Parsear fecha de numero de orden`, fecha);
				let params = {
					soap_method: "GetResults",
					pstrSampleID: numero, //pstrSampleID
					pstrRegisterDate: fecha, //pstrRegisterDate
				};
				const resp = await axiosClient.get("/wso.ws.wResults.cls", { params });
				console.log(`API ORDENES`, resp);
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
						console.log(`RESULTADOS`, lista);
						console.log(`Obteniendo los reusltado s del aorden`, lista);
						resolve(lista);
					}
				);
			});
		}
	};
	try {
		const resultPaciente = await getPaciente();
		const detalles = await Promise.all(
			resultPaciente.map(async (element) => {
				const data = await getOrden(element.PA_ID1);
				console.log(`Obteniendo el numero de orden prmise`, data.SampleID);
				const resul = await getResult(data.SampleID);
				const listaTests = Array.isArray(resul.LabTests.LISLabTest)
					? resul.LabTests.LISLabTest
					: [resul.LabTests.LISLabTest];

				return {
					cedula: element.D_110,
					register: data.RegisterDate,
					numeroroden: data.SampleID,
					nombres: data.SurNameAndName,
					sexo: data.Sex,
					tests: listaTests.map((test) => ({
						TestID: test.TestID,
						TestName: test.TestName,
						Resultado: test.LabResults.LISLabResult.ValueResult,
						Unidad: test.PrimaryUnit,
					})),
				};
			})
		);

		res.json({
			ok: true,
			descargoExcel: detalles,
		});
	} catch (error) {
		console.error("Error al obtener los datos:", error);
	}
};

module.exports = {
	getResultsOrders,
	getOrders,
	getResultsSex,
	getOrdenesInfinity,
	getPacientes,
};
