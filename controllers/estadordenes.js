//const { response } = require("../response.json");

const fs = require("fs");
const path = require("path");

const getResultsOrders = async (req, res) => {
	const filePath = path.join(__dirname, "../response.json");
	const data = fs.readFileSync(filePath, "utf-8");
	const response = JSON.parse(data);
	console.log(response);

	res.status(200).json({ ok: true, results: response });
};


const getResultsSex = async (req, res) => {
	const filePath = path.join(__dirname, "../data.json");
	const data = fs.readFileSync(filePath, "utf-8");
	const response = JSON.parse(data);
	

	res.status(200).json({ ok: true, results: response });
};


const getOrders = async (req, res) => {
	const filePath = path.join(__dirname, "../ordenMensual.json");
	const data = fs.readFileSync(filePath, "utf-8");
	const response2 = JSON.parse(data);
	const response = response2;

	console.log(response);
	res.status(200).json({ ok: true, ordenes: response });
};


module.exports = { getResultsOrders, getOrders,getResultsSex };
