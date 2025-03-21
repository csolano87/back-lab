const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const db = require("../db/connection");
const Sequelize = require("sequelize");
var xmlparser = require("express-xml-bodyparser");
const socketIO = require("socket.io");
const http = require("http");
const { desconectar, mensaje } = require("../sockets/sockets");
const path = require("path");
const { truncate } = require("fs");
const { findLastIndex } = require("lodash");
const Especialidad = require("./tipogrupo");
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
			canton: "/api/canton",
			parroquia: "/api/parroquia",
			estadistica3: "/api/qc",
			pdf: "/api/pdf",
			pdfProcesos: "/api/procesos-pdf",
			estadisticaMicro: "/api/reportMicro",
			agendamiento: "/api/agendamiento",
			ordenexterna: "/api/ordenexterna",
			ordensais: "/api/ordensais",
			tareaProgramada: "/api/tarea",
			ordenManual: "/api/orden-manual",
			registroProceso: "/api/procesos",
			impresora: "/api/impresora",
			panelpruebas: "/api/panelPruebas",
			productos: "/api/productos",
			importacion: "/api/pedido-importacion",
			equipos: "/api/equipos",
			cliente: "/api/cliente",
			marca: "/api/marca",
			stock: "/api/stock",
			pedidos: "/api/pedidos-stock",
			cargaUpload: "/api/carga-upload",
			stockpruebas: "/api/stock-pruebas",
			/*dashboard*/
			reparacion: "/api/reparacion",
			modelo: "/api/modelo",
			contrato: "/api/contrato",
			modalidad: "/api/modalidad",
			solicitudpresupesto: "/api/solicitudpresupuesto",
			requerimientoequipo: "/api/requerimientoequipo",
			aprobarprocesos: "/api/aprobacionproceso",
			ubicacion: "/api/ubicacion",
			estado: "/api/estado",
			accesorio: "/api/accesorio",
			estadofinanciero: "/api/financiero",
			estadoproceso: "/api/estadoproceso",
			tipocontrato: "/api/tipocontrato",
			analizador: "/api/analizador",
			accesoriocotizacion: "/api/accesoriocotizacion",
			cotizacion: "/api/cotizacion",
			correos: "/api/correos",
			tipomuestra: "/api/tipomuestra",
			/* nuevo ingreso de orden */

			paciente: "/api/paciente",
			medico: "/api/medico",
			ingresorden: "/api/ingresorden",
			perfiles: "/api/perfiles",
			tiposervicio: "/api/tiposervicio",
			tipoatencion: "/api/tipoatencion",
			tipogrupo: "/api/tipogrupo",
			diagnostico: "/api/diagnostico",
			especialidad: "/api/especialidad",
			equipocomplementario: "/api/equipocomplementario",
			estadofinancieroproveedor: "/api/estadofinancieroproveedor",
			estadofinancierocliente: "/api/estadofinancierocliente",
			bodega: "/api/bodega",
			result: "/api/result",
			transferencia: "/api/transferencia",
			dashboardviews: "/api/dashboardviews",
			unidad: "/api/unidad",
			tipofisiologico: "/api/tipofisiologico",
			unidadedad: "/api/unidadedad",
			rangos: "/api/rangos",
			tecnica: "/api/tecnica",
			muestras: "/api/muestras",
			validacion: "/api/validacion",
			menu: "/api/menu",
			menuRoles: "/api/permisos",
			estadoOrdenes:"/api/estadordenes",
			notificarDespacho:"/api/notificar",
				despachopedido:"/api/despachopedido"
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

	middlewares() {
		this.app.use(
			cors({
				origin: true,
				methods: ["GET", "POST", "PUT", "DELETE"],
				credentials: true,
			})
		);
		this.app.use(cookieParser());

		this.app.use(express.json());
		this.app.use(express.static(path.join(__dirname, "public")));
		this.app.use(xmlparser());

		this.app.use(express.static("public"));
		this.httpServer = new http.Server(this.app);
		this.io = socketIO(this.httpServer, {
			cors: {
				origin: "http://localhost:4200", // Cambia esto a la URL de tu cliente Angular
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
			db.sync({ force: false }).then(() => {
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

			desconectar(cliente);
		});
	}
	routes() {
		this.app.use(this.paths.auth, require("../routes/auth"));
		this.app.use(this.paths.categorias, require("../routes/categoria"));
		this.app.use(this.paths.usuarios, require("../routes/usuarios"));
		this.app.use(this.paths.infinity, require("../routes/infinity"));
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
		this.app.use(this.paths.tubos, require("../routes/tubo"));
		this.app.use(this.paths.generarId, require("../routes/id"));
		this.app.use(this.paths.generararchivo, require("../routes/generarhl7"));
		this.app.use(this.paths.estadistica, require("../routes/report"));
		this.app.use(this.paths.estadisticaMicro, require("../routes/reportMicro"));
		this.app.use(this.paths.estadistica2, require("../routes/reportTotal"));
		this.app.use(this.paths.estadistica3, require("../routes/qc"));
		this.app.use(this.paths.provincia, require("../routes/provincia"));
		this.app.use(this.paths.canton, require("../routes/canton"));
		this.app.use(this.paths.parroquia, require("../routes/parroquia"));
		this.app.use(this.paths.pdf, require("../routes/pdf")); //
		this.app.use(this.paths.pdfProcesos, require("../routes/reportePdf"));
		this.app.use(this.paths.agendamiento, require("../routes/agendamiento"));
		this.app.use(this.paths.ordenexterna, require("../routes/ordenexterna"));
		this.app.use(this.paths.ordensais, require("../routes/ordensais"));
		//this.app.use(this.paths.tareaProgramada, require("../routes/tarea"));
		this.app.use(this.paths.ordenManual, require("../routes/ordenManual"));
		this.app.use(this.paths.registroProceso, require("../routes/proceso"));
		this.app.use(this.paths.impresora, require("../routes/impresora"));
		this.app.use(this.paths.panelpruebas, require("../routes/panelPruebas"));
		this.app.use(
			this.paths.importacion,
			require("../routes/pedidoimportacion")
		);
		this.app.use(this.paths.productos, require("../routes/productos"));
		this.app.use(this.paths.equipos, require("../routes/equipos"));
		this.app.use(this.paths.marca, require("../routes/marca"));
		this.app.use(this.paths.cliente, require("../routes/cliente"));
		this.app.use(this.paths.stock, require("../routes/stock"));
		this.app.use(this.paths.pedidos, require("../routes/pedidoStock"));
		this.app.use(this.paths.cargaUpload, require("../routes/cargaUpload"));
		this.app.use(this.paths.stockpruebas, require("../routes/stock-pruebas"));

		/*dashboard*/
		this.app.use(this.paths.reparacion, require("../routes/reparacion"));
		this.app.use(this.paths.modelo, require("../routes/modelo"));
		this.app.use(this.paths.contrato, require("../routes/contrato"));
		this.app.use(this.paths.modalidad, require("../routes/modalidad"));
		this.app.use(
			this.paths.solicitudpresupesto,
			require("../routes/solicitudpresupuesto")
		);
		this.app.use(
			this.paths.requerimientoequipo,
			require("../routes/requerimientoequipo")
		);
		this.app.use(
			this.paths.aprobarprocesos,
			require("../routes/aprobarprocesos")
		);
		this.app.use(this.paths.ubicacion, require("../routes/ubicacion"));
		this.app.use(this.paths.estado, require("../routes/estado"));
		this.app.use(this.paths.accesorio, require("../routes/accesorio"));
		this.app.use(
			this.paths.estadofinanciero,
			require("../routes/estadofinanciero")
		);
		this.app.use(this.paths.tipocontrato, require("../routes/tipocontrato"));
		this.app.use(this.paths.estadoproceso, require("../routes/estadoproceso"));
		this.app.use(this.paths.analizador, require("../routes/analizador"));
		this.app.use(
			this.paths.accesoriocotizacion,
			require("../routes/accesoriocotizacion")
		);
		this.app.use(this.paths.cotizacion, require("../routes/cotizacion"));

		this.app.use(this.paths.correos, require("../routes/correos"));
		this.app.use(this.paths.tipomuestra, require("../routes/tipomuestra"));
		/* nuevo ingresoorden */
		this.app.use(this.paths.paciente, require("../routes/paciente"));
		this.app.use(this.paths.medico, require("../routes/medico"));
		this.app.use(this.paths.ingresorden, require("../routes/ingresorden"));
		this.app.use(this.paths.perfiles, require("../routes/perfiles"));

		this.app.use(this.paths.tipoatencion, require("../routes/tipoatencion"));
		this.app.use(this.paths.tiposervicio, require("../routes/tiposercicio"));
		this.app.use(this.paths.tipogrupo, require("../routes/tipogrupo"));
		this.app.use(this.paths.diagnostico, require("../routes/diagnostico"));
		this.app.use(this.paths.especialidad, require("../routes/especialidad"));
		this.app.use(
			this.paths.equipocomplementario,
			require("../routes/equipocomplementario")
		);
		this.app.use(
			this.paths.estadofinancieroproveedor,
			require("../routes/estadofinancieroproveedor")
		);
		this.app.use(
			this.paths.estadofinancierocliente,
			require("../routes/estadofinancierocliente")
		);
		this.app.use(this.paths.bodega, require("../routes/bodega"));
		this.app.use(this.paths.result, require("../routes/result"));
		this.app.use(this.paths.transferencia, require("../routes/transferencia"));
		this.app.use(
			this.paths.dashboardviews,
			require("../routes/dashboardviews")
		);

		this.app.use(
			this.paths.tipofisiologico,
			require("../routes/tipofisiologico")
		);

		this.app.use(this.paths.unidadedad, require("../routes/unidadedad"));

		this.app.use(this.paths.unidad, require("../routes/unidad"));
		this.app.use(this.paths.rangos, require("../routes/rangoreferencia"));
		this.app.use(this.paths.tecnica, require("../routes/tecnica"));
		this.app.use(this.paths.muestras, require("../routes/muestras"));
		this.app.use(this.paths.validacion, require("../routes/validacionPruebas"));
		this.app.use(this.paths.menu, require("../routes/menu"));
		this.app.use(this.paths.menuRoles, require("../routes/menuRoles"));
		this.app.use(this.paths.estadoOrdenes, require("../routes/estadordenes"))/* notificarDespacho */
		this.app.use(this.paths.notificarDespacho, require("../routes/notificarDespacho"))/* notificarDespacho */
		this.app.use(this.paths.despachopedido, require("../routes/despachopedido"))/* notificarDespacho */
	}

	listen() {
		this.httpServer.listen(this.port, () => {
			console.log("Servidor corriendo en puerto", this.port);
		});
	}
}

module.exports = Server;
