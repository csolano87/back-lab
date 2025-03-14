const fs = require("fs");

const axios = require("axios").default;
//const dataXX = require("../dataXX.json");
//const serverBCK = require("../serverBCK.json");
const localStorage = require("localStorage");
const xml2js = require("xml2js");
const stripNS = require("xml2js").processors.stripPrefix;
const csvToJson = require("convert-csv-to-json");
const { loginInfinity } = require("../helpers/loginInfinity");
const { isArray, sample } = require("lodash");
const { numberToString } = require("pdf-lib");
const createresult = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ ok: false, msg: `No existe archivo` });
	}

	let fileInputName = req.file.path;

	
	let dat = csvToJson.getJsonFromCsv(fileInputName);



	const CacheUserName = "_SYSTEM";
	const CachePassword = "INFINITY";
	const credentials = `${CacheUserName}:${CachePassword}`;
	const encodedToken = Buffer.from(credentials).toString("base64");
	const responseToken = await loginInfinity(encodedToken);

	let params = {
		soap_method: "GetResults",
		pstrSessionKey: `${responseToken}`,
		pstrOrderDateFrom: "2024-10-22",
		pstrOrderDateTo: "2024-10-22",
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
	res.json(data)



	/* fs.readFile("data.xml", function (err, data) {
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

				const datafinal =
					result.Body.GetResultsResponse.GetResultsResult.Orders.LISOrder;
				datafinal.forEach((objeto) => {
					const GroupsArray = objeto.LabTests.LISLabTest;
					if (Array.isArray(GroupsArray)) {
						const GroupsList = GroupsArray.map((item) => {
							//console.log(item.TestID);
							const referenciaObjeto = serverBCK.find(
								(ref) => ref.Descripción === item.TestName
							);

							if (referenciaObjeto) {
								return {
									...item,
									TestID: referenciaObjeto.IDexterno,
								};
							} else {
								console.log(`es objectoooooo`);

								const referenciaObjeto = serverBCK.find(
									(ref) => ref.Descripción === item.TestName
								);
								if (referenciaObjeto) {
									return {
										...item,
										TestID: referenciaObjeto.IDexterno,
									};
								}
							}

							return item;
						});

						objeto.LabTests.LISLabTest = GroupsList;
					} else if (typeof GroupsArray === "object" && GroupsArray !== null) {
						const referenciaObjeto = serverBCK.find(
							(ref) => ref.Descripción === GroupsArray.TestName
						);

						if (referenciaObjeto) {
							GroupsArray.TestID = referenciaObjeto.IDexterno;
						}

						objeto.LabTests.LISLabTest = GroupsArray;
					} else {
						console.log("GROUPSARRAY no es un array ni un objeto manejable");

						const referenciaObjeto = serverBCK.find(
							(ref) => ref.Descripción === GroupsArray.TestName
						);
						if (referenciaObjeto) {
							GroupsArray.TestID = referenciaObjeto.IDexterno;
						}

						objeto.LabTests.LISLabTest = GroupsArray;
					}
				});

				const datasuperfinal = datafinal.map((item) => {
					if (item.OptionalDemogList) {
						if (Array.isArray(item.LabTests.LISLabTest)) {
							return {
								HIS: item.OptionalDemogList.LISElementValue[0].Value,
								SampleID: item.SampleID,
								TestID: item.LabTests.LISLabTest.map((test) => ({
									TestID: test.TestID,
									TestName: test.TestName,
									GroupID: test.GroupID,
									TechValDate: test.LabResults.LISLabResult.TechValDate,
									TechValHour: test.LabResults.LISLabResult.TechValHour,
								})),
							};
						} else if (
							typeof item.LabTests.LISLabTest === "object" &&
							item.LabTests.LISLabTest !== null
						) {
							return {
								SampleID: item.SampleID,
								HIS: item.OptionalDemogList.LISElementValue[0].Value,
								TestID: item.LabTests.LISLabTest.TestID,
								TestName: item.LabTests.LISLabTest.TestName,
								GroupID: item.LabTests.LISLabTest.GroupID,
								TechValDate:
									item.LabTests.LISLabTest.LabResults.LISLabResult.TechValDate,
								TechValHour:
									item.LabTests.LISLabTest.LabResults.LISLabResult.TechValHour,
							};
						} else {
							console.log(
								`LISLabTest no es ni un array ni un objeto manejable`
							);
							return null;
						}
					}

					return null;
				});

				const filteredData = datasuperfinal.filter((item) => {
					if (item && item.HIS && item.TestID) {
						const testIDs = Array.isArray(item.TestID)
							? item.TestID
							: [{ TestID: item.TestID }];

						return !dat.some((it) => {
							console.log(`>>>>>>`, it.GroupName);
							if (it.GroupName !== "HOMAIR") {
								return (
									it.NUMERO_DE_ORDEN.toString() === item.HIS &&
									testIDs.some(
										(testObj) => testObj.Descripción === it.GroupName
									)
								);
							}
							return (
								it.NUMERO_DE_ORDEN.toString() === item.HIS &&
								testIDs.some((testObj) => testObj.TestID === it.IDexterno)
							);
						});
					}

					return false;
				});

				res.json({ resultados: filteredData.flat() });
				//res.json({ resultados: datasuperfinal });
			}
		);
	}); */
};

module.exports = {
	createresult,
};
