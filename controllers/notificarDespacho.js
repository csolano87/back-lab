const Notificardespacho = require("../models/notificarDespacho")



const getNotificar =async(req,res)=>{
const notificar =await  Notificardespacho.findAll({})
res.status(200).json({ok:true, notificar})
}


const postNotificar =async()=>{
    
}

module.exports={getNotificar, postNotificar}