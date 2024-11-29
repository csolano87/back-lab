const express = require("express");
const cors = require("cors");
//const { infinity } = require('../controllers/infinity');
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const db = require("../db/connection");
const { Sequelize } = require("sequelize");
var xmlparser = require("express-xml-bodyparser");
const { sequelize } = require("./cabecera");
const socketIO = require("socket.io");
const http = require("http");
const { desconectar, mensaje } = require("../sockets/sockets");
require("../db/asociations");

//const store=new session.MemoryStore;
class Server {
  static instance;
  constructor() {
    if (Server.instance) {
      return Server.instance;
    }

    Server.instance = this;
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      infinity: "/api/buscar",
      categorias: "/api/ordenes",
      usuarios: "/api/usuarios",
      roles: "/api/roles",
      /*nuevo router*/
      ordenes: "/api/orden",
      buscarordenes: "/api/buscarordenes",
      pacientes: "/api/pacientes",
      login: "/api/login",
      doctor: "/api/doctor",
      orden: "/api/orden",
      servicio: "/api/servicio",

      sala: "/api/sala",
      centrosalud: "/api/centrosalud",
      operador: "/api/operador",
      flebotomista: "/api/flebotomista",
      tipotubo: "/api/tipotubo",

      mail: "/api/mail",
      password: "/api/password",
      resetpassword: "/api/resetpassword",
      pruebas: "/api/pruebas",
      pruebasMicro: "/api/pruebaMicro",
      tubos: "/api/tubos",
      generarId: "/api/id",
      generararchivo: "/api/archivo",
      estadistica: "/api/report",
      estadistica2: "/api/reportTotal",
      provincia: "/api/provincia",
      estadistica3: "/api/qc",
      pdf: "/api/pdf",
      agendamiento: "/api/agendamiento",
      ordenexterna: "/api/ordenexterna",
      ordensais: "/api/ordensais",
      tareaProgramada: "/api/tarea",
      ordenManual: "/api/orden-manual",
    };
    // Conectar a base de datos
    this.dbConnection();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Server();
    }
    return this.instance;
  }
  //192.168.11.10
  middlewares() {
    this.app.use(
      cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      }),
    );
    this.app.use(cookieParser());
    /* this.app.use(
            cookieSession({
                keys: ['veryimportantsecret'],
                name: 'session',
                cookie: {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                },
            })
        ); */

    this.app.use(express.json());

    this.app.use(xmlparser());

    this.app.use(express.static("public"));
    this.httpServer = new http.Server(this.app);
    this.io = socketIO(this.httpServer, {
      cors: {
        origin: "http://localhost:4401", // Cambia esto a la URL de tu cliente Angular
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      },
    });
    //  this.httpServer = http.createServer(this.app);
    this.escucharSockets();
  }
  async dbConnection() {
    try {
      await db.authenticate();
      sequelize.sync({ force: false }).then(() => {
        console.log("Database online");
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  escucharSockets() {
    console.log("Escuchando conexiones");

    this.io.on("connection", (cliente) => {
      console.log("Cliente conectado");
      //   this.io.on('connection', cliente => {
      //conectar(cliente);
      // mensaje(cliente);
      desconectar(cliente);

      //});
    });
  }
  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categorias, require("../routes/categoria"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.infinity, require("../routes/infinity"));
    /*nuevas router*/

    this.app.use(this.paths.roles, require("../routes/roles"));
    this.app.use(this.paths.buscarordenes, require("../routes/buscarordenes"));

    this.app.use(this.paths.login, require("../routes/login"));
    this.app.use(this.paths.pacientes, require("../routes/pacientes"));
    this.app.use(this.paths.doctor, require("../routes/doctor"));
    this.app.use(this.paths.orden, require("../routes/orden"));
    this.app.use(this.paths.servicio, require("../routes/servicio"));

    this.app.use(this.paths.sala, require("../routes/sala"));
    this.app.use(this.paths.centrosalud, require("../routes/centroSalud"));
    this.app.use(this.paths.operador, require("../routes/operador"));
    this.app.use(this.paths.flebotomista, require("../routes/flebotomista"));
    this.app.use(this.paths.tipotubo, require("../routes/tipoTubo"));

    this.app.use(this.paths.mail, require("../routes/mail"));
    this.app.use(this.paths.password, require("../routes/password"));
    this.app.use(this.paths.resetpassword, require("../routes/resetPassword"));
    this.app.use(this.paths.pruebas, require("../routes/pruebas"));
    this.app.use(this.paths.pruebasMicro, require("../routes/pruebasMicro"));
    this.app.use(
      this.paths.tubos,
      require("../routes/tubo"),
    ); /* generarId:'api/id'*/
    this.app.use(this.paths.generarId, require("../routes/id"));
    this.app.use(this.paths.generararchivo, require("../routes/generarhl7"));
    this.app.use(this.paths.estadistica, require("../routes/report"));
    this.app.use(this.paths.estadistica2, require("../routes/reportTotal"));
    this.app.use(this.paths.estadistica3, require("../routes/qc"));
    this.app.use(this.paths.provincia, require("../routes/provincias"));
    this.app.use(this.paths.pdf, require("../routes/pdf")); //
    this.app.use(this.paths.agendamiento, require("../routes/agendamiento"));
    this.app.use(this.paths.ordenexterna, require("../routes/ordenexterna"));
    this.app.use(this.paths.ordensais, require("../routes/ordensais"));
    this.app.use(this.paths.tareaProgramada, require("../routes/tarea"));
    this.app.use(this.paths.ordenManual, require("../routes/ordenManual"));
  }

  listen() {
    this.httpServer.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
