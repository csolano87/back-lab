const axios = require("axios").default;

const nodemailer = require("nodemailer");
const path = require("node:path");
const mailer = require("../templates/signup-mail");
const pdf = require("html-pdf");

const fs = require("fs");
const Proceso = require("../models/proceso");
const { where } = require("sequelize");
const { erGet } = require("./infinity");

const stripNS = require("xml2js").processors.stripPrefix;
//const parser = new xml2js.Parser({ attrkey: "ATTR" });

const mail = async (req, res) => {
	const { numeroroden, nombres } = req.body;
    const reportePdf = await erGet(numeroroden);
	// CONFIGRAR TIPO DE CORREO
	let transporter;

	transporter = nodemailer.createTransport({
		host: "smtp.office365.com",
		port: 587,
		secure: false,
		requireTLS: true,
		//AGREGAR CCORREO Y PASS
		auth: {
			user: "",
			pass: "",
		},
	});

	if (req.file) {
		// Si req.file existe, agregar la segunda parte del objeto al array
		const attachmentContent = fs.readFileSync(req.file.path);
		attachments.push({
			filename: req.file.originalname,
			content: attachmentContent,
		});
	}

	let mail_options = {
		from: '"SISTEMAS" <christian.solano@distprolab.com>',
		to: maillist,
		// AGREGAR ASUNTO
		subject: ` `,
		// ADJUNTO
		attachments: "",
	};

	transporter.sendMail(mail_options, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			// console.log("Correo se envió con éxito: " + info.response);
			res.status(201).json({
				ok: true,
				msg: `Se ha enviado con exito}`,
			});
		}
	});
};

const estadic = async (req, res) => {};

module.exports = { mail, estadic };
