const fs=require("fs")

const postTramitirOrden = async (req, res) => {
for (const orden of req.body) {

    const {}=orden;


    fs.writeFileSync(`${filename}`, data);
    
    
}

	res.status(200).json({
		okt: true,
	});
};

module.exports = {
	postTramitirOrden,
};
