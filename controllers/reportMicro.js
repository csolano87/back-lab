const express = require("express");

const localStorage = require("localStorage");
const axios = require("axios").default;
const xml2js = require("xml2js");

const stripNS = require("xml2js").processors.stripPrefix;

const { parse } = require("path");
const { axiosClient } = require("../helpers/axiosClient");

const getMicro = async (req, res) => {
	function stripNS(tagName) {
		// Supongamos que el nombre de la etiqueta tiene el formato "namespace:nombre"
		// Esta función eliminará el espacio de nombres y devolverá solo el nombre
		const parts = tagName.split(":");
		return parts[parts.length - 1];
	}

	const getResult = async () => {
		return new Promise(async (resolve, reject) => {
			const { FECHADESDE, FECHAHASTA } = req.query;

			console.log("FECHADESDE", FECHADESDE);
			console.log("FECHAHASTA", FECHAHASTA);

			const startDate = new Date(FECHADESDE);
			const endDate = new Date(FECHAHASTA);

			let responseData = [];

			const makerequest = async (date) => {
				let params = {
					soap_method: "GetMicroResults",
					pstrOrderDateFrom: date.toISOString(),
					pstrOrderDateTo: date.toISOString(),
				};

				const resp = await axiosClient.get("/wso.ws.wResults.cls", { params });

				const data = resp.data;

				responseData.push(data);
			};

			for (
				let date = startDate;
				date <= endDate;
				date.setDate(date.getDate() + 1)
			) {
				await makerequest(date);
			}

			const parser = new xml2js.Parser({
				explicitArray: false,
				mergeAttrs: false,
				explicitRoot: false,
				ignoreAttrs: true,

				tagNameProcessors: [stripNS],
			});
			const parsedDataPromises = responseData.map((xml) => {
				return new Promise((resolve, reject) => {
					parser.parseString(xml, (err, result) => {
						if (err) {
							reject(err);
						} else {
							resolve(result);
						}
					});
				});
			});

			Promise.all(parsedDataPromises).then((parsedData) => {
				const flattenedData = parsedData.flat();

				const nuevoArray = [];
				flattenedData.forEach(function (elemento) {
					var lisOrder =
						elemento.Body.GetMicroResultsResponse?.GetMicroResultsResult?.Orders
							?.LISOrder;
					if (lisOrder) {
						nuevoArray.push(lisOrder);
					}
				});

				const nuevoArray2 = nuevoArray.flat();
				resolve(nuevoArray2);
			});
		});
	};

	const getOrden = async (sampleIdArray) => {
		return new Promise(async (resolve, reject) => {
			let params = {
				soap_method: "GetList",
				pstrSampleID: `${sampleIdArray}`,
			};

			const res = await axiosClient.get("/wso.ws.wOrders.cls", { params });

			xml2js.parseString(
				res.data,
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
					//result.Body.GetMicroResultsResponse.GetMicroResultsResult.Orders.LISOrder;
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
			resultsOrden.map(async (item) => {
				const data = await getOrden(item.SampleID);

				const LisLabTest =
					item.MicSpecs.LISMicSpec.MicTests.LISLabTest.MicIsolates
						?.LISMicIsolate?.MicAntibiograms?.LISMicAntibiogram?.MicAntibiotics;
				const LisLabMicTest =
					item.MicSpecs.LISMicSpec.MicTests.LISLabTest.MicIsolates
						?.LISMicIsolate?.MicAntibiograms?.LISMicAntibiogram;

				const resultName =
					item.MicSpecs.LISMicSpec.MicTests.LISLabTest.MicIsolates
						?.LISMicIsolate;

						const listest =Array.isArray(item.MicSpecs.LISMicSpec.MicTests.LISLabTest)
					?item.MicSpecs.LISMicSpec.MicTests.LISLabTest :[item.MicSpecs.LISMicSpec.MicTests.LISLabTest];
				const LISLabTests = Array.isArray(LisLabTest)
					? LisLabTest
					: [LisLabTest];

				/* const Mictest = LISLabTests.map(
					(item) =>
						item.MicIsolates?.LISMicIsolate?.MicAntibiograms?.LISMicAntibiogram
							.MicAntibiotics
				); */
				return {
					FechaIngreso:data.RegisterDate,
					SampleID: item.SampleID,
					Origen:data.Origin,
					cedula:'',
					Servicio: data.Service,
					Historia: data.PatientID1,
					Paciente: data.SurNameAndName,
					Edad:data.Age,
					Sexo: data.Sex,
				

					Tipomuestra: '',

					Microorganismo: resultName?.ResultName,
					Tecnica: LisLabMicTest?.MethodName,
					Valor: LisLabTest?.LISMicAntibiotic.map((val) =>
						val.MethodResult
							? val.MethodResult.replace("0,", "0.")
							: val.MethodResult
					).join(","),
					Antibiotico: LisLabTest?.LISMicAntibiotic.map(

						(anti) => anti.AntibioticName
					).join(","),
					Sensible: LisLabTest?.LISMicAntibiotic.map(
						(sen) => sen.ValueResultName
					).join(","),

					Comentario: listest.map(item=> item?.ResultComments?.LISComments?.TextComment).join(","),//
					Validador: listest.map(item=> item?.CliValUser).join(","),
					FechaValidacion:listest.map(item=> item?.CliValDate).join(",") ,
					OrdenAS400:item.OptionalDemogList.LISElementValue[0].Value,
				};
			})
		);

		res.json({
			ok: true,
			listaordenes: detalles,
		});
	} catch (error) {
		console.error("Error al obtener los datos:", error);
	}
};

module.exports = { getMicro };
