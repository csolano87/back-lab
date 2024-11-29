const csvToJson = require("convert-csv-to-json");
const moment = require("moment");
const fs = require("fs");
const excelToJson = require("convert-excel-to-json");
const cargaUpload = async (req, res) => {
	moment.locale("es");
	const hoy = moment();
	const fechaH = hoy.format().slice(0, 10).replaceAll("-", "");
	console.log(`fechaH`, fechaH);

	const horaToma = hoy.format("LTS").replaceAll(":", "");
	//console.log(req.file.path);
	let docname = req.file.path;
	let arrayjson = csvToJson.getJsonFromCsv(docname);
	console.log(arrayjson);
	for (const data of arrayjson) {

		
		console.log(`data`, data.IDPRUEBAS);

		const fileName = `${data.HISTORIACLINICA}.res`;
		/* let ASTM = `${data.numero}`; */

		//const pruebas =data.IDPRUEBAS.map(({IDPRUEBAS})=>`${IDPRUEBAS}`)

		let ASTM =
			`MSH|^~\&|Sistema de Gestion Hospitalaria|Uees Biolab|Infinity|Uees Biolab|${fechaH}${horaToma}||OML^O21^OML_O21|${fechaH}${horaToma}|P|2.5|${fechaH}${horaToma}||||EC|8859/1|es\n` +
			`PID|1|${data.CEDULA}|${data.HISTORIACLINICA}||${data.APELLIDOS}^${data.NOMBRES}|AZAR|${data.FECHADENACIMIENTO}|${data.SEXO}|||||^^^^^^^^^^^0990190544 -\n` +
			`PV1||O||${data.CONVENIO}|||||||${data.PC}|||${data.CONVENIO}||${data.INGRESADO}|||${data.NUMERODESOLICITUD}\n` +
			`ORC|NW|2406103358|||||||${fechaH}${horaToma}|||${data.DOCTOR}|${data["ORIGENLOCALIZACION(PROCEDENCIA-INFINITY)"]}||||${data["DIAGNOSTICO(SERVICIO-INFINITY)"]}|||||||EMP|\n`;
		//+`OBR||||${pruebas}^GLUCOSA\n`
		/* +`OBR|1|||1538^GLUCOSA\n`
        +`OBR|2|||1617^TGP\n`
        +`OBR|3|||1616^TGO\n`
        +`OBR|4|||1549^ACIDO URICO\n`
        +`OBR|5|||1601^CALCIO IONICO\n`
        +`OBR|6|||1603^CLORO\n`
        +`OBR|7|||1605^POTASIO\n`
        +`OBR|8|||1604^SODIO\n`
        +`OBR|9|||1555^CREATININA\n`
        +`OBR|10|||1540^UREA\n`
        +`OBR|11|||593^BIOMETRIA HEMATICA\n`  */

		/*   const fileName = `${ordenId}.res`;

        let ASTM =
                    `H|^&|Roche^^Diagnostics|||Res^Interface||||||P||\n` +
                    `P|1|/${ordenId}/|/${superdata.PatientID1}/||/${superdata.LastName}^/${superdata.FirstName}/||${Date}|${superdata.Sex}|${anio}${mes}${dia}|${hora}||||||\n` +
                    `R|1|^^5030|/${nuevdata[31]}/|||||||||${anio}${mes}${dia}|${hora}\n` +
                    `R|1|^^5085|/${nuevdata[33]}/|||||||||${anio}${mes}${dia}|${hora}\n` +
                    `R|1|^^5100|/${nuevdata[36]}/|||||||||${anio}${mes}${dia}|${hora}\n` +
                    `R|1|^^5124|/${nuevdata[37]}/|||||||||${anio}${mes}${dia}|${hora}\n` +
                    `R|1|^^5070|/${nuevdata[38]}/|||||||||${anio}${mes}${dia}|${hora}\n` +
                    `R|1|^^5095|/${nuevdata[39]}/|||||||||${anio}${mes}${dia}|${hora}\n` +
                   
                    `L|1|F`; */

		fs.writeFileSync(`${fileName}`, `${ASTM}`),
			"UTF-8",
			function (err) {
				if (err) {
					console.log(err);
				}
			};
	}

	res.status(200).json({ pk: true, msg: arrayjson });
};

module.exports = {
	cargaUpload,
};
