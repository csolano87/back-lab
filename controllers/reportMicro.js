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
const { string, array } = require("i/lib/util");
const { Result } = require("express-validator");
const { parse } = require("path");

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

			const CacheUserName = "_SYSTEM";
			const CachePassword = "INFINITY";
			const credentials = `${CacheUserName}:${CachePassword}`;
			const encodedToken = Buffer.from(credentials).toString("base64");
			const responseToken = await loginInfinity(encodedToken);
			const makerequest = async (date) => {
				let params = {
					soap_method: "GetMicroResults",

					pstrSessionKey: `${responseToken}`,
					pstrOrderDateFrom: date.toISOString(),
					pstrOrderDateTo: date.toISOString(),
					/*  pstrOrderDateFrom: `${FECHADESDE}`,
                     pstrOrderDateTo: `${FECHAHASTA}`
          */
				};

				const rawcookies = localStorage.getItem("rawcookies");

				const orden = axios.create({
					baseURL: `${process.env.baseURL}/wso.ws.wResults.cls`,
					params,

					headers: { cookie: rawcookies },
				});

				const resp = await orden.get();

				const data = resp.data;
				console.log(data)
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

		/*    const { FECHADESDE, FECHAHASTA } = req.query;

           console.log('FECHADESDE', FECHADESDE);
           console.log('FECHAHASTA', FECHAHASTA);
        
           const startDate = new Date(FECHADESDE);
           const endDate = new Date(FECHAHASTA);
           let responseData = [];

           const CacheUserName = '_SYSTEM';
           const CachePassword = 'INFINITY';
           const credentials = `${CacheUserName}:${CachePassword}`;
           const encodedToken = Buffer.from(credentials).toString('base64');
           const responseToken = await loginInfinity(encodedToken);





           const makeRequest = async (date) => {
            

               let params = {
                   soap_method: 'GetMicroResults',
                   pstrSessionKey: `${responseToken}`,
                   pstrOrderDateFrom: date.toISOString(),
                   pstrOrderDateTo: date.toISOString(),
               };

               const rawcookies = localStorage.getItem('rawcookies');
               try {
               const orden = axios.create({
                   baseURL: `${process.env.baseURL}/wso.ws.wResults.cls`,
                   params,
                   headers: { cookie: rawcookies },
               });


               const resp = await orden.get();
               const data = resp.data;
               responseData.push(data);

           } catch (error) {
               console.error('Error en la solicitud:', error);
           }
       } */
		/* fin nuevoo */

		/*  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
             await makeRequest(date);

         }
           
     xml2js.parseString(responseData,
          { 
             explicitArray: false,
              mergeAttrs: true,
               explicitRoot: false,
                tagNameProcessors: [stripNS],
              },
           (err, result) => {


         if (err) {
             throw err
         }
         console.log(result)
         const lista = result.Body.GetMicroResultsResponse.GetMicroResultsResult;
         resolve(lista)
     })
     }); */
		/*      await Promise.all(Array.from({ length: (endDate - startDate) / (24 * 60 * 60 * 1000) + 1 }, (_, index) => {
                 const date = new Date(startDate);
                 date.setDate(startDate.getDate() + index);
                 return makeRequest(date);
             }));
         
             return new Promise((resolve, reject) => {
                 xml2js.parseString(
                     responseData.join(''),  // Unir todos los datos en una cadena
                     {
                         explicitArray: false,
                         mergeAttrs: true,
                         explicitRoot: false,
                         tagNameProcessors: [stripNS],
                     },
                     (err, result) => {
                         if (err) {
                             console.error('Error al analizar XML:', err);
                             reject(err);
                         } else {
                             console.log(result);
                             const lista = result.Body.GetMicroResultsResponse.GetMicroResultsResult;
                             resolve(lista);
                         }
                     }
                 );
            // });
         }); */
	};

	const getOrden = async (sampleIdArray) => {
		return new Promise(async (resolve, reject) => {
			const responseToken = localStorage.getItem("sn");

			let params = {
				soap_method: "GetList",
				pstrSessionKey: `${responseToken}`,
				pstrSampleID: `${sampleIdArray}`,
			};

			const rawcookies = localStorage.getItem("rawcookies");

			const orden = axios.create({
				baseURL: `http://172.16.197.209/csp/acb/wso.ws.wOrders.cls`,
				params,
				headers: { cookie: rawcookies },
			});
			const res = await orden.get();

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

					if (listaorden != null) {
						if (Array.isArray(listaorden) === true) {
							resolve(listaorden);
						} else {
							let listArray = [];
							listArray.push(listaorden);

							resolve(listArray);
						}
					} else {
						console.log("NO TIENE ORDENES GENERADAS EN EL DIA DE HOY");
					}
				}
			);
		});
	};

	const dataArray = [];

	//const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
	getResult().then((lista) => {
		lista.forEach(async (element, index) => {
			setTimeout(() => {
				getOrden(element.SampleID).then((data) => {
					console.log(`codigo abajo`, element.SampleID);

					const micTests = element.MicSpecs.LISMicSpec;

					const lisLabTests = [];

					if (Array.isArray(micTests) === true) {
						// Si es un array, recorre los elementos
						micTests.forEach((micTest) => {
							// console.log(`*`,micTest)

							if (micTest.MicTests.LISLabTest) {
								lisLabTests.push(micTest.MicTests.LISLabTest);
							}
						});
					} else {
						// Si es un objeto y contiene LISLabTest

						lisLabTests.push(micTests.MicTests.LISLabTest);
					}

					const te = lisLabTests.forEach((t) => t.ResultComments);
					const lisLabTests2 = [];

					if (Array.isArray(te) === true) {
						te.forEach((rt) => {
							if (rt.LISComments.TextComment) {
								lisLabTests2.push(rt.LISComments.TextComment);
							}
						});
					} else {
						// Si es un objeto y contiene LISLabTest

						lisLabTests2.push(te);
					}

					const micro = element.MicSpecs.LISMicSpec;

					const ListMicro = [];

					if (Array.isArray(micro) === true) {
						micro.forEach((micr) => {
							if (micr.MicTests.LISLabTest.MicIsolates) {
								ListMicro.push(
									micr.MicTests.LISLabTest.MicIsolates.LISMicIsolate
								);
							} else {
							}
						});
					} else {
						if (micro.MicTests.LISLabTest.MicIsolates) {
							if (
								Array.isArray(
									micro.MicTests.LISLabTest.MicIsolates.LISMicIsolate
								) == true
							) {
								micro.MicTests.LISLabTest.MicIsolates.LISMicIsolate.forEach(
									(mcro) => {
										ListMicro.push(mcro);
									}
								);
							}

							ListMicro.push(
								micro.MicTests.LISLabTest.MicIsolates.LISMicIsolate
							);
						}

						console.log(`no existe LISMicIsolate `);
					}

					listOr = [];
					const microt = element.MicSpecs.LISMicSpec;
					//VALIDAR ARRAY MICROT
					if (Array.isArray(microt) === true) {
						microt.forEach((micr) => {
							if (micr.MicTests.LISLabTest.MicIsolates) {
								listOr.push(micr.MicTests.LISLabTest.MicIsolates.LISMicIsolate);
							} else {
								console.log("NO EXISTE micr.MicTests.LISLabTest.MicIsolates");
								//listOr.push(microt.MicTests.LISLabTest.MicIsolates)
							}
						});
						// OBJECTO MICROT
					} else {
						if (microt.MicTests.LISLabTest.MicIsolates) {
							//VALIDAR SI ES  OBJECTO ARRAY MICROT microt.MicTests.LISLabTest.MicIsolates.LISMicIsolate
							if (
								Array.isArray(
									microt.MicTests.LISLabTest.MicIsolates.LISMicIsolate
								) == true
							) {
								//RECORRER ARRAY
								microt.MicTests.LISLabTest.MicIsolates.LISMicIsolate.forEach(
									(mcro) => {
										if (mcro.MicAntibiograms) {
											mcro.MicAntibiograms.LISMicAntibiogram.MicAntibiotics.LISMicAntibiotic.forEach(
												(ant) => {
													listOr.push(ant);
												}
											);
										} else {
											console.log(
												"no existe mcro.MicAntibiograms",
												mcro.MicAntibiograms
											);
										}
									}
								);
							} else {
								//ELSE OBJECTO MICROT
								if (
									microt.MicTests.LISLabTest.MicIsolates.LISMicIsolate
										.MicAntibiograms
								) {
									microt.MicTests.LISLabTest.MicIsolates.LISMicIsolate.MicAntibiograms.LISMicAntibiogram.MicAntibiotics.LISMicAntibiotic.forEach(
										(lis) => {
											listOr.push(lis);
										}
									);
								}
								console.log("no existe  kk");
							}
						} else {
							console.log("ok");
						}
					}

					const item = {
						SampleID: element.SampleID,
						Servicio: data[0].Service,
						Paciente: data[0].SurNameAndName,
						Sexo: data[0].Sex,
						Historia: data[0].PatientID1,
						Tipomuestra: lisLabTests.map((test) => test.TestName).join(","),
						//  PacienteH:lisLabTests.map((test) => test.ResultComments ? test.ResultComments.LISComments.TextComment.slice(1):'no existe' ).join(', '),
						Microorganismo: ListMicro.map((mk) => mk.ResultName).join(","),
						Tecnica: ListMicro.map((mk) =>
							mk.MicAntibiograms
								? mk.MicAntibiograms.LISMicAntibiogram.MethodName
								: ""
						).join(","),
						Valor: listOr
							.map((val) =>
								val.MethodResult
									? val.MethodResult.replace("0,", "0.")
									: val.MethodResult
							)
							.join(","),
						Antibiotico: listOr.map((anti) => anti.AntibioticName).join(","),
						Sensible: listOr.map((sen) => sen.ValueResultName).join(","),
					};

					dataArray.push(item);
					console.log("1", dataArray.length);
					console.log("12", lista.length);
					if (dataArray.length === lista.length) {
						res.json({ ok: true, listaordenes: dataArray });
					}
					//res.json({ ok: true, listaordenes: dataArray });

					//}
				});
			}, index * 1000);
		});
	});
};

module.exports = { getMicro };
