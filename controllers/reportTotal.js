const express = require("express");
const { Request, Response } = require("express");
const Cabecera = require("../models/cabecera");
const localStorage = require("localStorage");
const axios = require("axios").default;
const xml2js = require("xml2js");
const fs = require("fs");
const _ = require("lodash");
const appt = express();
const { loginInfinity } = require("../helpers/loginInfinity");
const { key } = require("localStorage");
const stripNS = require("xml2js").processors.stripPrefix;
const login = require("./login");
const { CLIENT_RENEG_LIMIT } = require("tls");
const { Console } = require("console");
const { string, array } = require("i/lib/util");
const { forIn } = require("lodash");
const { parse } = require("path");

const csvParser = require("csv-parser");
const getregistroTotal = async (req, res) => {
	const { FECHADESDE, FECHAHASTA } = req.query;

	console.log("FECHADESDE", FECHADESDE);
	console.log("FECHAHASTA", FECHAHASTA);

	const startDate = new Date(FECHADESDE);
	const endDate = new Date(FECHAHASTA);

	let responseData = [];

	const CacheUserName = "_SYSTEM";
	const CachePassword = "INFINITY";
	const credentials = `${CacheUserName}:${CachePassword}`;
	const encodedToken = Buffer.from(credentials).toString("base64");
	const responseToken = await loginInfinity(encodedToken);

	const pru = [
		{
			id: "1",
			nombre: "% HB GLICOSILADA",
		},
		{
			id: "2",
			nombre: "AC. ANTI CHAGAS",
		},
		{
			id: "3",
			nombre: "ACIDO URICO",
		},
		{
			id: "4",
			nombre: "AG. CARCINOEMBRIONARIO",
		},
		{
			id: "5",
			nombre: "ALBUMINA",
		},
		{
			id: "6",
			nombre: "ALFAFETOPROTEINA",
		},
		{
			id: "7",
			nombre: "ALT / TGP",
		},
		{
			id: "8",
			nombre: "AMILASA",
		},
		{
			id: "9",
			nombre: "ANTI PEPTIDO CITRULINADO",
		},
		{
			id: "10",
			nombre: "ANTICUERPOS ANTINUCLEARES",
		},
		{
			id: "11",
			nombre: "AST / TGO",
		},
		{
			id: "12",
			nombre: "ASTO CUANTITATIVO",
		},
		{
			id: "13",
			nombre: "BACILOSCOPIA (TUBERCULOSI",
		},
		{
			id: "14",
			nombre: "BILIRRUBINA DIRECTA",
		},
		{
			id: "15",
			nombre: "BILIRRUBINA INDIRECTA",
		},
		{
			id: "16",
			nombre: "BILIRRUBINA TOTAL",
		},
		{
			id: "17",
			nombre: "BIOMETRIA HEMATICA",
		},
		{
			id: "18",
			nombre: "C.A 125",
		},
		{
			id: "19",
			nombre: "C.A 15-3",
		},
		{
			id: "20",
			nombre: "C.A 19-9",
		},
		{
			id: "21",
			nombre: "C3",
		},
		{
			id: "22",
			nombre: "C4",
		},
		{
			id: "23",
			nombre: "CALCIO",
		},
		{
			id: "24",
			nombre: "CALCIO IONICO",
		},
		{
			id: "25",
			nombre: "CALCITONINA",
		},
		{
			id: "26",
			nombre: "CARGA VIRAL PARA HIV",
		},
		{
			id: "27",
			nombre: "CITOMEGALOVIRUS IGM",
		},
		{
			id: "28",
			nombre: "CK TOTAL",
		},
		{
			id: "29",
			nombre: "CKMB",
		},
		{
			id: "30",
			nombre: "CLORO",
		},
		{
			id: "31",
			nombre: "CODO DERECHO",
		},
		{
			id: "32",
			nombre: "CODO IZQUIERDO",
		},
		{
			id: "33",
			nombre: "COLESTEROL TOTAL",
		},
		{
			id: "34",
			nombre: "COLINESTERASA",
		},
		{
			id: "35",
			nombre: "COPROPARASITARIO",
		},
		{
			id: "36",
			nombre: "COPROPARASITARIO SERIADO",
		},
		{
			id: "37",
			nombre: "CREATININA",
		},
		{
			id: "38",
			nombre: "DENGUE IGM",
		},
		{
			id: "39",
			nombre: "DENGUE NS1",
		},
		{
			id: "40",
			nombre: "FACTOR REUMATOIDEO",
		},
		{
			id: "41",
			nombre: "FACTOR RH",
		},
		{
			id: "42",
			nombre: "FOSFATASA ALCALINA",
		},
		{
			id: "43",
			nombre: "FT3",
		},
		{
			id: "44",
			nombre: "GAMMA G.T.",
		},
		{
			id: "45",
			nombre: "GASOMETRIA ARTERIAL",
		},
		{
			id: "46",
			nombre: "GLUCOSA",
		},
		{
			id: "47",
			nombre: "GLUCOSA 2H POSTPRANDIAL",
		},
		{
			id: "48",
			nombre: "GLUCOSA EN GLUCOTEST",
		},
		{
			id: "49",
			nombre: "GRUPO SANGUINEO",
		},
		{
			id: "50",
			nombre: "HCG-BETA (CUANTITATIVO)",
		},
		{
			id: "51",
			nombre: "HE4",
		},
		{
			id: "52",
			nombre: "HELYCOBACTER PYLORI IGG",
		},
		{
			id: "53",
			nombre: "HELYCOBACTER PYLORI IGM",
		},
		{
			id: "54",
			nombre: "HEPATITIS A (ANTI HAV IGM",
		},
		{
			id: "55",
			nombre: "HEPATITIS B (HBSAG)",
		},
		{
			id: "56",
			nombre: "HEPATITIS C",
		},
		{
			id: "57",
			nombre: "HERPES I - II IGM",
		},
		{
			id: "58",
			nombre: "HIERRO",
		},
		{
			id: "59",
			nombre: "HIV  AC - AG",
		},
		{
			id: "60",
			nombre: "HIV 1/2 AC - AG",
		},
		{
			id: "61",
			nombre: "INDICE DE RIESGO DE MALIG",
		},
		{
			id: "62",
			nombre: "INR",
		},
		{
			id: "63",
			nombre: "INSULINA",
		},
		{
			id: "64",
			nombre: "LDH",
		},
		{
			id: "65",
			nombre: "LEPTOSPIRA",
		},
		{
			id: "66",
			nombre: "LEPTOSPIRA AC",
		},
		{
			id: "67",
			nombre: "LIPASA",
		},
		{
			id: "68",
			nombre: "LIPOARABINOMANANO",
		},
		{
			id: "69",
			nombre: "LIQUIDO PLEURAL",
		},
		{
			id: "70",
			nombre: "OREJA DERECHA",
		},
		{
			id: "71",
			nombre: "OREJA IZQUIERDA",
		},
		{
			id: "72",
			nombre: "ORINA EXAMEN GENERAL",
		},
		{
			id: "73",
			nombre: "PEPTIDO C",
		},
		{
			id: "74",
			nombre: "POTASIO",
		},
		{
			id: "75",
			nombre: "PROCALCITONINA",
		},
		{
			id: "76",
			nombre: "PROGESTERONA",
		},
		{
			id: "77",
			nombre: "PROLACTINA",
		},
		{
			id: "78",
			nombre: "PROTEINA C REACTIVA (CUAN",
		},
		{
			id: "79",
			nombre: "PROTEINAS EN ORINA DE 24 ",
		},
		{
			id: "80",
			nombre: "PROTEINAS TOTALES",
		},
		{
			id: "81",
			nombre: "PRUEBA DE COMPATIBILIDAD ",
		},
		{
			id: "82",
			nombre: "PRUEBA DE COOMBS DIRECTO",
		},
		{
			id: "83",
			nombre: "PRUEBA DE COOMBS INDIRECT",
		},
		{
			id: "84",
			nombre: "PRUEBAS PRETRANSFUSIONALE",
		},
		{
			id: "85",
			nombre: "PSA LIBRE",
		},
		{
			id: "86",
			nombre: "PSA TOTAL",
		},
		{
			id: "87",
			nombre: "RELACION   PSA L / PSA T",
		},
		{
			id: "88",
			nombre: "RESULTADO CREATININA ORIN",
		},
		{
			id: "89",
			nombre: "ROTAVIRUS",
		},
		{
			id: "90",
			nombre: "RUBEOLA IGM",
		},
		{
			id: "91",
			nombre: "SANGRE OCULTA HECES",
		},
		{
			id: "92",
			nombre: "SERO-GLOBULINA",
		},
		{
			id: "93",
			nombre: "SIFILIS ANTICUERPOS",
		},
		{
			id: "94",
			nombre: "SODIO",
		},
		{
			id: "95",
			nombre: "TEST DE COOMBS DIRECTO",
		},
		{
			id: "96",
			nombre: "TEST DE COOMBS INDIRECTO",
		},
		{
			id: "97",
			nombre: "TEST DE EMBARAZO",
		},
		{
			id: "98",
			nombre: "TIEMPO DE COAGULACION",
		},
		{
			id: "99",
			nombre: "TIEMPO DE PROTROMBINA",
		},
		{
			id: "100",
			nombre: "TIEMPO DE SANGRIA",
		},
		{
			id: "101",
			nombre: "TIEMPO DE TROMBOPLASTINA",
		},
		{
			id: "102",
			nombre: "TOXOPLASMA IGM",
		},
		{
			id: "103",
			nombre: "TRANSFERRINA",
		},
		{
			id: "104",
			nombre: "TRIGLICERIDOS",
		},
		{
			id: "105",
			nombre: "TROPONINA I",
		},
		{
			id: "106",
			nombre: "TSH",
		},
		{
			id: "107",
			nombre: "UREA",
		},
		{
			id: "108",
			nombre: "VDRL",
		},
	];

	arrayJson = [
		{
			id: "2009",
			prueba: "MONOCITOS %",
		},
		{
			id: "2002",
			prueba: "NEUTROFILOS",
		},
		{
			id: "2007",
			prueba: "NEUTROFILOS %",
		},
		{
			id: "2033",
			prueba: "PLAQUETAS",
		},
		{
			id: "2012",
			prueba: "RECUENTO DE G.ROJOS",
		},
		{
			id: "2021",
			prueba: "VOLUMEN CORPUSCULAR MEDIO",
		},
		{
			id: "2036",
			prueba: "VOLUMEN MEDIO PLAQUETARIO",
		},
		{
			id: "5015",
			prueba: "ASPECTO",
		},
		{
			id: "5090",
			prueba: "BACTERIAS",
		},
		{
			id: "5060",
			prueba: "BILIRRUBINAS",
		},
		{
			id: "5070",
			prueba: "CELULAS EPITELIALES ALTAS",
		},
		{
			id: "5095",
			prueba: "CILINDROS HIALINOS",
		},
		{
			id: "2010",
			prueba: "COLOR",
		},
		{
			id: "5100",
			prueba: "CRISTALES",
		},
		{
			id: "5050",
			prueba: "CUERPOS CETONICOS",
		},
		{
			id: "5020",
			prueba: "DENSIDAD",
		},
		{
			id: "5124",
			prueba: "ESPORAS DE HONGOS",
		},
		{
			id: "5068",
			prueba: "FILAMENTO MUCOSO",
		},
		{
			id: "5045",
			prueba: "GLUCOSA EN ORINA",
		},
		{
			id: "5085",
			prueba: "HEMATIES",
		},
		{
			id: "5030",
			prueba: "LEUCOCITOS",
		},
		{
			id: "5087",
			prueba: "LEUCOCITOS",
		},
		{
			id: "5035",
			prueba: "NITRITOS",
		},
		,
		{
			id: "9902",
			prueba: "ORINA EXAMEN GENERAL",
		},
		{
			id: "5025",
			prueba: "pH",
		},
		{
			id: "5040",
			prueba: "PROTEINAS",
		},
		{
			id: "5065",
			prueba: "SANGRE EN ORINA",
		},
		{
			id: "6055",
			prueba: "UROBILINOGENO",
		},
		{
			id: "3316",
			prueba: "COVID-AG",
		},
	];
	const makeRequest = async (date) => {
		let params = {
			soap_method: "GetResults",
			pstrSessionKey: `${responseToken}`,
			pstrOrderDateFrom: date.toISOString(),
			pstrOrderDateTo: date.toISOString(),
		};

		const rawcookies = localStorage.getItem("rawcookies");

		const orden = axios.create({
			baseURL: `${process.env.baseURL}/wso.ws.wResults.cls`,
			params,

			headers: { cookie: rawcookies },
		});

		const resp = await orden.get();
		const data = resp.data;
		responseData.push(data);
	};
	for (
		let date = startDate;
		date <= endDate;
		date.setDate(date.getDate() + 1)
	) {
		await makeRequest(date);
	}
	const parser = new xml2js.Parser({
		explicitArray: false,
		mergeAttrs: true,
		explicitRoot: false,
		tagNameProcessors: [stripNS],
	});
	const parsedDataPromises = responseData.map((xmlData) => {
		return new Promise((resolve, reject) => {
			parser.parseString(xmlData, (err, result) => {
				if (err) {
					reject(err);
				} else {
					res.json(
						result.Body.GetResultsResponse.GetResultsResult.Orders.LISOrder
					);
					/*  resolve(
                      result.Body.GetResultsResponse.GetResultsResult.Orders
                          .LISOrder
                  ); */
				}
			});
		});
	});

	Promise.all(parsedDataPromises)
		.then((parsedData) => {
			const flattenedData = parsedData.flat();
			console.log(flattenedData);
			const groupedData = {};

			for (const item of flattenedData) {
				let labTests = item.LabTests.LISLabTest;

				if (!Array.isArray(labTests)) {
					labTests = [labTests];
				}

				for (const labTest of labTests) {
					const testName = labTest.TestName;
					const registerDate = labTest.RegisterDate;

					if (!groupedData[testName]) {
						groupedData[testName] = {};
					}

					if (!groupedData[testName][registerDate]) {
						groupedData[testName][registerDate] = 0;
					}

					groupedData[testName][registerDate]++;
				}
			}

			const listapruebas = [];

			for (const testName in groupedData) {
				const registerDates = groupedData[testName];
				const registerDateCounts = [];

				for (const registerDate in registerDates) {
					const count = registerDates[registerDate];
					registerDateCounts.push({
						RegisterDate: registerDate,
						Count: count,
					});
				}

				listapruebas.push({
					TestName: testName,
					RegisterDateCounts: registerDateCounts,
				});
			}
			/*   res.json(listapruebas); */
		})
		.catch((error) => {
			// Manejar el error
			// res.status(500).json({ error: 'Error al analizar los datos XML' });
		});

	/*  const arrayData = [];

fs.createReadStream('dicc.csv')
    .pipe(csvParser())
    .on('data', (row) => {
        arrayData.push(row);
    })
    .on('end', () => {
        res.json(arrayData);
    });
 */

	/* xml2js.parseString(
        responseData,
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

            const listaordenes =
                result.Body.GetResultsResponse.GetResultsResult.Orders.LISOrder;  */

	/*   const groupedData = {};

             for (const item of listaordenes) {
                 let labTests = item.LabTests.LISLabTest;

                 if (!Array.isArray(labTests)) {
                     labTests = [labTests];
                 }

                 for (const labTest of labTests) {
                     const testName = labTest.TestName;
                     const registerDate = labTest.RegisterDate;

                     if (!groupedData[testName]) {
                         groupedData[testName] = {};
                     }

                     if (!groupedData[testName][registerDate]) {
                         groupedData[testName][registerDate] = 0;
                     }

                     groupedData[testName][registerDate]++;
                 }
             }

             const listapruebas = [];

             for (const testName in groupedData) {
                 const registerDates = groupedData[testName];
                 const registerDateCounts = [];

                 for (const registerDate in registerDates) {
                     const count = registerDates[registerDate];
                     registerDateCounts.push({
                         RegisterDate: registerDate,
                         Count: count,
                     });
                 }

                 listapruebas.push({
                     TestName: testName,
                     RegisterDateCounts: registerDateCounts,
                 });
             } */

	// Enviar los resultados como JSON utilizando res.json

	// } );
};
module.exports = { getregistroTotal };
