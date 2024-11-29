const jwt = require("jsonwebtoken");

const generarJWT = (id) => {
  //console.log(id)
  return new Promise((resolve, reject) => {
    const payload = { id };
    jwt.sign(
      payload,
      process.env.SECRETOPRIVATEKEY,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se logro generar el token");
        } else {
          resolve(token);
        }
      },
    );
  });
};

module.exports = { generarJWT };
