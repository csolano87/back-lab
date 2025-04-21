const fs = require("fs");
const moment = require("moment");
const path = require("path");
const out_dir = String.raw`E:\Temp\HCA\RESULTADO`;

moment.locale("es");
const postTramitirOrden = async (req, res) => {
	const now = moment();
	const fechaHora = now
		.format("YYYY-MM-DD HH:mm:ss")
		.slice(0, 10)
		.replaceAll("-", "");

	console.log(`FECHA NUEVA DEL siEtam`, fechaHora);
	//console.log(`fecha`, now);

	for (const orden of req.body) {
		const { numeroorden, nombres, historia, sexo, fechanac, pruebaImport } =
			orden;
		const fechaNac = fechanac.slice(0, 10).replaceAll("-", "");
		//const fecha = `${now}`.slice(0, 10).replaceAll("-", "");testID
		const pruebas = pruebaImport
			//.filter((item) => item.resultado !== null && item.resultado !== "")
			.filter((item) => item.resultado !== null && item.resultado != "")
			.map(
				(item, i) =>
					`R|${i}|^^${item.testID}|${item.resultado}|||||||||${fechaHora}|:44:01`
			).join('\n');

		if (pruebas.length > 0) {
			const filename = path.join(out_dir, `ORD_${numeroorden}.RES`);
			const data =`H|^&|Roche^^Diagnostics|||Res^Interface||||||P||\n` +
				`P|1|${numeroorden}|${historia}||${nombres.replaceAll(',','').replaceAll('.','')}^.||${fechaNac}|${sexo}|${fechaHora}|:44:01||||||\n` +
				`${pruebas}\n` +
				`L|1|F`;

			fs.writeFileSync(`${filename}`, data);
			//fs.writeFileSync("finalData2.txt", cleaned);
		}
	}

	res.status(200).json({
		okt: true,
		
	});
};

module.exports = {
	postTramitirOrden,
};
