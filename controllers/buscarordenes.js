

const localStorage = require("localStorage");
const axios = require("axios").default;
const xml2js = require("xml2js");
const stripNS = require("xml2js").processors.stripPrefix;




const { axiosClient } = require("../helpers/axiosClient");

const buscarordenes = async (req, res) => {
  const { cedula } = req.params;



  const rawcookies = localStorage.getItem("rawcookies");
  let params = {
    soap_method: `${process.env.Ordenes}`,
  //  pstrSessionKey: `${tokenID}`,
    pstrPatientID2: `${cedula}`,
  };

  try {
   

    const respo = await axiosClient.get('/wso.ws.wOrders.cls',{params});
    const path2 = `${respo.data}`;
    xml2js.parseString(
      path2,
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

        const listaordene =
          result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet.SQL;

        console.log(listaordenes.SurNameAndName);

        const listaordenes =Array.isArray(listaordene) ?listaordene: [listaordene];
        res.status(200).json({
          ok: true,
          listaordenes: listaordenes,

      
        })
      },
    );
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ ok: false, "ERROR DEL SERVER": error });
  }
};

const buscarordene = async (req, res) => {
  const { PatientID1, SampleID, apellido } = req.query;
 

  let params = {
    soap_method: `${process.env.Ordenes}`,

    pstrPatientID1: `${PatientID1}`.replace("undefined", ""),
    pstrSampleID: `${SampleID}`.replace("undefined", ""),
    pstrLastName: `${apellido}`.replace("undefined", ""),
    pstrRegisterDateFrom: "2021-01-01",
    pstrRegisterDateTo: "2050-01-01",
  };


  const resp = await axiosClient.get('/wso.ws.wOrders.cls',{params});
  console.log(resp.data)

  try {
    xml2js.parseString(
      resp.data,
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

        const listaordene =
          result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet.SQL;

        if (listaordene != undefined || listaordene != null) {
        


          const listaordenes =Array.isArray(listaordene) ?listaordene: [listaordene];
          res.status(200).json({
            ok: true,
            listaordenes: listaordenes,
          });
        } else {
          res.status(400).json({ ok: true, msg: `No existe orden ` });
        }
      },
    );
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

module.exports = {
  buscarordene,
  buscarordenes,
};
