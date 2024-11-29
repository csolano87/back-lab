const { Request, Response } = require("express");
const fs = require("fs");
const XLSX = require("xlsx");
const csv = require("csv-parser");
const Papa = require("papaparse");
const { json } = require("sequelize");
const XlsxPopulate = require("xlsx-populate");
const _ = require("lodash");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const json2xls = require("json2xls");
const path = require("path");
const out_dir = String.raw`C:\Users\devel\Videos\resultados63.csv`;
const getqc = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No se recibió ningún archivo" });
	}

	const muestra = [
		{ id: 1, nombre: "GLUCOSA", nombrecorto: "GLU" },
		{ id: 2, nombre: "COLESTEROL", nombrecorto: "COLT" },
		{ id: 3, nombre: "TRIGLICERIDOS", nombrecorto: "TG" },
		{ id: 4, nombre: "UREA" },
		{ id: 5, nombre: "CREATININA", nombrecorto: "CREA" },
		{ id: 6, nombre: "AC. URICO", nombrecorto: "AURIC" },
		{ id: 7, nombre: "TGO" },
		{ id: 8, nombre: "TGP" },
		{ id: 9, nombre: "Fos. Alcali", nombrecorto: "FALK" },
		{ id: 10, nombre: "Bil total", nombrecorto: "BT" },
		{ id: 11, nombre: "Bil directa", nombrecorto: "BD" },
		{ id: 12, nombre: "Amilasa" },
		{ id: 13, nombre: "LIPASA" },
		{ id: 14, nombre: "Proteina Total" },
		{ id: 15, nombre: "Albumina", nombrecorto: "ALB" },
		{ id: 16, nombre: "GGT" },
		{ id: 17, nombre: "Fe" },
		{ id: 18, nombre: "LDH" },
		{ id: 19, nombre: "CKL" },
		{ id: 20, nombre: "CKMB" },
		{ id: 21, nombre: "LDHL" },
		{ id: 22, nombre: "CRPLX" },
		{ id: 23, nombre: "Na" },
		{ id: 24, nombre: "Cl" },
		{ id: 25, nombre: "iCa" },
		{ id: 26, nombre: "K" },
		{ id: 27, nombre: "COLIN" },
		{ id: 28, nombre: "C3" },
		{ id: 29, nombre: "C4" },
		{ id: 30, nombre: "P" },
		{ id: 31, nombre: "PCR" },
		{ id: 32, nombre: "PROTT" },
	];
  
	const archivoCSV = req.file; // Supongamos que recibes el archivo CSV en req.file

	// Define la ruta de destino con un nombre de archivo más corto

	//  const archivoCSV = req.file.buffer.toString();

	const datosCSV = [];

	// Lee el archivo CSV
	fs.readFile(archivoCSV.path, "utf-8", (error, data) => {
		if (error) {
			console.error("Error al leer el archivo CSV:", error);
			return;
		}

		const lineas = data.trim().split("\n");

		// Obtiene los nombres de las cabeceras
		const cabeceras = lineas[0].split(";");

		// Recorre las líneas del CSV y crea un objeto JSON por cada línea
		const objetosJSON = [];

		for (let i = 1; i < lineas.length; i++) {
			const campos = lineas[i].split(";");
			const objetoJSON = {};
			for (let j = 0; j < cabeceras.length; j++) {
				objetoJSON[cabeceras[j]] = campos[j];
			}
			if (objetoJSON.Control === "PCCC1 " || objetoJSON.Control === "PCCC2 ") {
				objetosJSON.push(objetoJSON);
			}
		}

		// Recorre el array de objetos JSON
		objetosJSON.forEach((objeto) => {
			const prueba = objeto.Prueba.trim();

			// Busca el objeto en el array muestra con la propiedad Prueba igual a la prueba actual
			const objetoMuestra = muestra.find((item) => item.nombrecorto === prueba);

			// Si se encuentra un objeto en muestra con el nombre coincidente
			if (objetoMuestra) {
				// Si existe la propiedad nombrecorto en el objetoMuestra, se asigna su valor a nombre en el objeto actual
				if (objetoMuestra.nombrecorto) {
					objeto.Prueba = objetoMuestra.nombre;
				}
			}
		});

		const grupos = {};

		objetosJSON.forEach((dato) => {
			const control = dato["Control"];
			const prueba = dato["Prueba"];
			if (!grupos[control]) {
				grupos[control] = {};
			}
			if (!grupos[control][prueba]) {
				grupos[control][prueba] = [];
			}
			grupos[control][prueba].push(dato);
		});

		const csvWriter = createCsvWriter({
			path: "resultados63.csv",
			header: [
				{ id: "Control", title: "Control" },
				{ id: "Prueba", title: "Prueba" },

				{ id: "Fecha1", title: "Fecha-1" },
				{ id: "Resultado1", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha2", title: "Fecha-2" },
				{ id: "Resultado2", title: "Resultado" },
				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha3", title: "Fecha-3" },
				{ id: "Resultado3", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha4", title: "Fecha-4" },
				{ id: "Resultado4", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha5", title: "Fecha-5" },
				{ id: "Resultado5", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha6", title: "Fecha-6" },
				{ id: "Resultado6", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha7", title: "Fecha-7" },
				{ id: "Resultado7", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha8", title: "Fecha-8" },
				{ id: "Resultado8", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha9", title: "Fecha-9" },
				{ id: "Resultado9", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha10", title: "Fecha-10" },
				{ id: "Resultado10", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha11", title: "Fecha-11" },
				{ id: "Resultado11", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha12", title: "Fecha-12" },
				{ id: "Resultado12", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha13", title: "Fecha-13" },

				{ id: "Resultado13", title: "Resultado" },
				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha14", title: "Fecha-14" },
				{ id: "Resultado14", title: "Resultado" },
				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha15", title: "Fecha-15" },
				{ id: "Resultado15", title: "Resultado" },
				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha16", title: "Fecha-16" },
				{ id: "Resultado16", title: "Resultado" },
				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha17", title: "Fecha-17" },
				{ id: "Resultado17", title: "Resultado" },
				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha18", title: "Fecha-18" },
				{ id: "Resultado18", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha19", title: "Fecha-19" },
				{ id: "Resultado19", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha20", title: "Fecha-20" },
				{ id: "Resultado20", title: "Resultado" },
				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha21", title: "Fecha-21" },
				{ id: "Resultado21", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha22", title: "Fecha-22" },
				{ id: "Resultado22", title: "Resultado" },
				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },

				{ id: "Fecha23", title: "Fecha-23" },
				{ id: "Resultado23", title: "Resultado" },
				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },
				{ id: "Fecha24", title: "Fecha-24" },
				{ id: "Resultado24", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },
				{ id: "Fecha25", title: "Fecha-25" },
				{ id: "Resultado25", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },
				{ id: "Fecha26", title: "Fecha-26" },
				{ id: "Resultado26", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },
				{ id: "Fecha27", title: "Fecha-27" },
				{ id: "Resultado27", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },
				{ id: "Fecha28", title: "Fecha-28" },
				{ id: "Resultado28", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },
				{ id: "Fecha29", title: "Fecha-29" },
				{ id: "Resultado29", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },
				{ id: "Fecha30", title: "Fecha-30" },
				{ id: "Resultado30", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },
				{ id: "Fecha31", title: "Fecha-31" },
				{ id: "Resultado31", title: "Resultado" },

				{ id: "CORRELATIVO", title: "CORRELATIVO" },
				{ id: "VALOR 2", title: "VALOR 2" },
				{ id: "HORA 2", title: "HORA 2" },
				{ id: "ANALISTA", title: "ANALISTA" },
			],
		});

		const data1 = [];

		for (const control in grupos) {
			for (const prueba in grupos[control]) {
				const resultados = grupos[control][prueba];

				const fila = {
					Control: control.trim(),
					Prueba: prueba.trim(),
					Fecha1: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "01") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),

					Resultado1: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "01") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),

					Fecha2: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "02") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado2: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "02") {
								return resultado.Resultado.replace(",", "");
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha3: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "03") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado3: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "03") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha4: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "04") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado4: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "04") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha5: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "05") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado5: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "05") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha6: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "06") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado6: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "06") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha7: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "07") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado7: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "07") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha8: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "08") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado8: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "08") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha9: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "09") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado9: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "09") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha10: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "10") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado10: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "10") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fech11: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "11") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado11: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "11") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha12: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "12") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado12: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "12") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha13: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "13") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado13: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "13") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha14: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "14") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado14: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "14") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha15: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "15") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado15: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "15") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha16: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "16") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado16: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "16") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha17: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "17") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado17: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "17") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha18: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "18") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado18: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "18") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha19: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "19") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado19: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "19") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha20: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "20") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado20: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "20") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha21: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "21") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado21: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "21") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha22: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "22") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),

					Resultado23: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "22") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha23: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "23") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado23: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "23") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha24: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "24") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado24: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "24") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha25: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "25") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado25: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "25") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha26: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "26") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado26: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "26") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha27: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "27") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado27: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "27") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha28: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "28") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado28: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "28") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha29: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "29") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado29: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "29") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha30: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "30") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado30: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "30") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Fecha31: resultados
						.map((resultado) => {
							if (resultado.Fecha.slice(0, 2) == "31") {
								return resultado.Fecha.slice(11, 16);
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
					Resultado31: resultados
						.map((resultado) => {
							const fecha = resultado.Fecha;
							if (fecha.slice(0, 2) == "31") {
								return resultado.Resultado;
							} else {
								return "";
							}
						})
						.find((valor) => valor !== ""),
				};
				data1.push(fila);
			}
		}
		/* nuevoooooo */
		const pruebasPresentes = data1.map((item) => item.Prueba);

		// Paso 2 y 3: Agregar las pruebas que están en muestra pero no en data1
		muestra.forEach((prueba) => {
			if (!pruebasPresentes.includes(prueba.nombre)) {
				data1.push({ Prueba: prueba.nombre, Control: "PCCC1" });
			}
		});

		muestra.forEach((prueba) => {
			if (!pruebasPresentes.includes(prueba.nombre)) {
				data1.push({ Prueba: prueba.nombre, Control: "PCCC2" });
			}
		});

		data1.sort((a, b) => {
			const indexA = muestra.findIndex((item) => item.nombre === a.Prueba);
			const indexB = muestra.findIndex((item) => item.nombre === b.Prueba);

			const controlA = a.Control;
			const controlB = b.Control;

			if (controlA.startsWith("PCCC1") && !controlB.startsWith("PCCC1")) {
				return -1;
			} else if (
				!controlA.startsWith("PCCC1") &&
				controlB.startsWith("PCCC1")
			) {
				return 1;
			} else {
				return indexA - indexB;
			}
		});

		/* const pruebasFaltantes = muestra.filter(
    (item) => !data1.some((el) => el.Prueba === item.nombre)
);

// Agregar las pruebas faltantes en `data1` manteniendo el orden basado en `id`
for (const prueba of muestra) {
    if (pruebasFaltantes.includes(prueba)) {
        data1.push(prueba);
    }
} */

		const filename = path.join(out_dir);
		//    res.json({ data1 });
		csvWriter
			.writeRecords(data1)

			.then(() => {
				console.log("Archivo CSV creado correctamente.");
				res.setHeader("Content-Type", "text/csv");
				res.setHeader("Content-Disposition", "attachment; ReporteQc.csv");

				const fileStream = fs.createReadStream("./resultados63.csv");
				fileStream.pipe(res);
			})

			.catch((error) => {
				console.error("Error al crear el archivo CSV:", error);
			});
	});
};
module.exports = {
	getqc,
};
