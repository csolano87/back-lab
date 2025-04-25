const express = require("express");

const nodemailer = require("nodemailer");


const fs = require("fs");


const stripNS = require("xml2js").processors.stripPrefix;
const xml2js = require("xml2js");
const { axiosClient } = require("../helpers/axiosClient");
const erGet = async (req, res) => {
	const { NUMEROORDEN } = req.params;

	const date =
		"20" +
		"" +
		NUMEROORDEN.substring(0, 2) +
		"-" +
		NUMEROORDEN.substring(2, 4) +
		"-" +
		NUMEROORDEN.substring(4, 6);
	const description = "NUEVO";
	
	const params = {
		soap_method: `${process.env.Reporte}`,
		//pstrSessionKey: `${tokenID}`,
		pstrSampleID: `${NUMEROORDEN}`,
		pstrRegisterDate: `${date}`,
		pstrFormatDescription: `${description}`,
		pstrPrintTarget: `${process.env.Target}`,
	};

	try {

		const response = await axiosClient.get('/wso.ws.wReports.cls',{params});

		xml2js.parseString(
			response.data,
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

				const pdf = result.Body.PreviewResponse.PreviewResult;

				if (pdf != undefined) {
					const report = pdf.replace("localhost", "192.168.1.97");

					console.log(report);
					res.status(200).json({
						success: true,
						status_server: response.status,
						pdf: report,
					});
				} else {
					res.status(400).json({
						success: false,
						pdf: "El numero de orden que ingresaste no es correcto verifica la orden y vuleve a intentar..",
					});
				}
			}
		);
	} catch (error) {
		res.status(404).json({ success: false, error: error });
	}
};
const getEnvioMail = async (req, res) => {
	const { numeroroden, nombres, correo } = req.body;
      const reportePDf = await erGet(numeroroden);
	  console.log(`Llamando Pdf `,reportePDf)
	let transporter;

	transporter = nodemailer.createTransport({
		host: "smtp.office365.com",
		port: 587,
		secure: false,
		requireTLS: true,

		auth: {
			user: "odalys.vera@distprolab.com",
			pass: "Distprolab2027",
		},
	});

	if (req.file) {
		/* [
            {

                filename: `${npdf}`, // the file name 
                 href:`${pdf}` ,
               
             
				}
          
			] */
		const attachmentContent = fs.readFileSync(req.file.path);
		attachments.push({
			filename: req.file.originalname,
			content: attachmentContent,
		});
	}

	let mail_options = {
		from: '"SISTEMAS" <christian.solano@distprolab.com>',

		subject: "",
	};
	transporter.sendMail(mail_options, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log("Correo se envió con éxito: " + info.response);
		}
	});
};

module.exports = { erGet, getEnvioMail };
