const { Model } = require("sequelize");
const Aprobar = require("../models/aprobarproceso");
const Cabecera = require("../models/cabecera");
const Cabecera_Agen = require("../models/cabecera_agen");
const Cliente = require("../models/cliente");
const Detalle = require("../models/detalle");
const Detalle_Agen = require("../models/detalle_agen");
const Equipos = require("../models/equipos");
const Itempedido = require("../models/itemPedido");
const ItemStock = require("../models/itemStock");
const Itempedidostock = require("../models/itempedidostock");
const Marca = require("../models/marca");
const Pedido = require("../models/pedido");
const PedidoStock = require("../models/pedidostock");
const Proceso = require("../models/proceso");
const Producto = require("../models/productos");
const Servicio = require("../models/servicio");
const Stock = require("../models/stock");
const Envase = require("../models/tipoTubo");
const Tubo = require("../models/tubo");
const Usuario = require("../models/usuarios");
const Modelo = require("../models/modelo");
const Estado = require("../models/estado");
const Ubicacion = require("../models/ubicacion");
const Accesorio = require("../models/accesorio");
const Solicitud_Proceso = require("../models/solicitud_proceso");
const Itemequipo = require("../models/itemEquipo");
const Estadoproceso = require("../models/estadoproceso");
const Tipocontrato = require("../models/tipocontrato");
const Analizador = require("../models/analizador");
const Tipomuestra = require("../models/tipomuestra");
const Perfil = require("../models/perfiles");
const Panel_pruebas = require("../models/panelPruebas");
const Itemprueba = require("../models/itemPruebas");
const Canton = require("../models/cantones");
const { foreign_key } = require("i/lib/methods");
const Provincia = require("../models/provincia");
const Parroquia = require("../models/parroquias");
const Tipogrupo = require("../models/tipogrupo");
const Equipocomplementario = require("../models/equiposcomplementarios");
const Cotizacion = require("../models/cotizacion");
const Itemcotizacion = require("../models/itemcotizacion");
const Modalidad = require("../models/modalidad");
const { modalidadDelete } = require("../controllers/modalidad");
const Estadofinancieroproveedor = require("../models/estadofinancieroproveedor");
const Estadofinancierocliente = require("../models/estadofinancierocliente");
const Historicoubicacion = require("../models/historicoubicacion");
const Historicoestado = require("../models/historicoestado");
const Bodega = require("../models/bodega");
const Rango = require("../models/rangosreferencia");
const Tipofisiologico = require("../models/tipofisiologico");
const Unidad = require("../models/unidad");
const Unidadedad = require("../models/unidadedad");
const Orden = require("../models/ordenes");
const Prueba = require("../models/pruebas");
const Paciente = require("../models/paciente");
const Medico = require("../models/medico");
const Diagnostico = require("../models/diagnostico");
const Tiposervicio = require("../models/tiposervicio");
const Tipoatencion = require("../models/Tipoatencion");
const Tecnica = require("../models/tecnica");
const Muestra = require("../models/muestras");

/* Producto.hasMany(Stock,{as:"inventario",foreignKey:"productoId"});
Stock.belongsTo(Producto,{as:"product"}) */

/* Relaciones de tablas con la tabla de usuarios */
Panel_pruebas.hasMany(Rango, { as: "rango", foreignKey: "panelpruebaId" });
Rango.belongsTo(Panel_pruebas, { as: "panelpruebas" });

Tipofisiologico.hasMany(Rango, {
	as: "rango",
	foreignKey: "tipofisiologicoId",
});
Rango.belongsTo(Tipofisiologico, { as: "tipofisiologico" });

Unidad.hasMany(Rango, { as: "rango", foreignKey: "unidadId" });
Rango.belongsTo(Unidad, { as: "unidad" });

Unidadedad.hasMany(Rango, { as: "rango", foreignKey: "unidadedadId" });
Rango.belongsTo(Unidadedad, { as: "unidadedad" });

Orden.hasMany(Prueba, { as: "prueba", foreignKey: "ordenId" });
Prueba.belongsTo(Orden, { as: "orden" });

Panel_pruebas.hasMany(Prueba, { as: "prueba", foreignKey: "panelpruebaId" });
Prueba.belongsTo(Panel_pruebas, { as: "panelprueba" });


Rango.hasOne(Prueba, { as: "prueba", foreignKey: "rangoId" });
Prueba.belongsTo(Rango, { as: "rango" });

Paciente.hasMany(Orden, { as: "orden", foreignKey: "pacienteId" });
Orden.belongsTo(Paciente, { as: "paciente" });

Medico.hasMany(Orden, { as: "orden", foreignKey: "medicoId" });
Orden.belongsTo(Medico, { as: "medico" });

Diagnostico.hasMany(Orden, { as: "orden", foreignKey: "diagnosticoId" });
Orden.belongsTo(Diagnostico, { as: "diagnostico" });

Tiposervicio.hasMany(Orden, { as: "orden", foreignKey: "tiposervicioId" });
Orden.belongsTo(Tiposervicio, { as: "tiposervicio" });

Tipoatencion.hasMany(Orden, { as: "orden", foreignKey: "tipoatencionId" });
Orden.belongsTo(Tipoatencion, { as: "tipoatencion" });

/* Panel_pruebas.hasMany(Prueba, { as: "prueba", foreignKey: "panelpruebaId" });
Prueba.belongsTo(Panel_pruebas, { as: "panelprueba" });


Rango.belongsTo(Prueba, { as: "prueba", foreignKey: "rangoId" });
Prueba.belongsTo(Rango, { as: "rango" }); */

Bodega.hasMany(Itempedidostock, {
	as: "itempedidostock",
	foreignKey: "bodegaId",
});
Itempedidostock.belongsTo(Bodega, { as: "bodega" });

Bodega.hasMany(ItemStock, { as: "stockItem", foreignKey: "bodegaId" });
ItemStock.belongsTo(Bodega, { as: "bodega" });

Usuario.hasMany(Marca, { as: "marca", foreignKey: "usuarioId" });
Marca.belongsTo(Usuario, { as: "usuario" });

Usuario.hasMany(Modelo, { as: "modelo", foreignKey: "usuarioId" });
Modelo.belongsTo(Usuario, { as: "usuario" });

Usuario.hasMany(Equipocomplementario, {
	as: "equipocomplementario",
	foreignKey: "usuarioId",
});
Equipocomplementario.belongsTo(Usuario, { as: "usuario" });

Usuario.hasMany(Analizador, { as: "instrumento", foreignKey: "usuarioId" });
Analizador.belongsTo(Usuario, { as: "usuario" });

Usuario.hasMany(Estado, { as: "status", foreignKey: "usuarioId" });
Estado.belongsTo(Usuario, { as: "usuario" });

Usuario.hasMany(Ubicacion, { as: "ubicacion", foreignKey: "usuarioId" });
Ubicacion.belongsTo(Usuario, { as: "usuario" });

Usuario.hasMany(Estadofinancieroproveedor, {
	as: "estadoproveedor",
	foreignKey: "usuarioId",
});
Estadofinancieroproveedor.belongsTo(Usuario, { as: "usuario" });

Usuario.hasMany(Estadofinancierocliente, {
	as: "estadocliente",
	foreignKey: "usuarioId",
});
Estadofinancierocliente.belongsTo(Usuario, { as: "usuario" });

/* Fin Relaciones de tablas con la tabla de usuarios */

Modalidad.hasMany(Cotizacion, { as: "cotizacion", foreignKey: "modalidadId" });
Cotizacion.belongsTo(Modalidad, { as: "modalidad" });

Cotizacion.hasMany(Itemcotizacion, {
	as: "itemcotizacion",
	foreignKey: "cotizacionId",
});
Itemcotizacion.belongsTo(Cotizacion, { as: "cotizacion" });

Analizador.hasMany(Itemcotizacion, {
	as: "itemcotizacion",
	foreignKey: "analizadorId",
});
Itemcotizacion.belongsTo(Analizador, { as: "instrumento" });

Provincia.hasMany(Canton, { as: "cantones", foreign_key: "provinciaId" });
Canton.belongsTo(Provincia, { as: "provincias" });

Canton.hasMany(Parroquia, { as: "parroquias", foreign_key: "cantonId" });
Parroquia.belongsTo(Canton, { as: "cantones" });

Modelo.hasMany(Analizador, { as: "instrumento", foreignKey: "modeloId" });
Analizador.belongsTo(Modelo, { as: "modelo" });

/* nuevo */
Marca.hasMany(Analizador, { as: "instrumento", foreignKey: "marcaId" });
Analizador.belongsTo(Marca, { as: "marca" });

/* fin */

Marca.hasMany(Modelo, { as: "modelo", foreignKey: "marcaId" });
Modelo.belongsTo(Marca, { as: "marca" });

Perfil.hasMany(Itemprueba, { as: "itempruebas", foreignKey: "perfilId" });
Itemprueba.belongsTo(Perfil, { as: "perfiles" });

Itemprueba.belongsTo(Panel_pruebas, {
	as: "panelprueba",
	foreignKey: "itempruebaId" /* cambie pruebaId */,
});
Panel_pruebas.belongsTo(Itemprueba, { as: "itempruebas" });

Modelo.hasMany(Panel_pruebas, { as: "panelprueba", foreignKey: "modeloId" });
Panel_pruebas.belongsTo(Modelo, { as: "modelo" });

Tecnica.hasOne(Panel_pruebas, { as: "panelprueba", foreignKey: "tecnicaId" });
Panel_pruebas.belongsTo(Tecnica, { as: "tecnica" });

Muestra.hasMany(Panel_pruebas, { as: "panelprueba", foreignKey: "muestraId" });
Panel_pruebas.belongsTo(Muestra, { as: "muestra" });

/* Tecnica.hasMany(Panel_pruebas, { as: "panelprueba", foreignKey: "modeloId" });
Panel_pruebas.belongsTo(Modelo, { as: "modelo" }); */

Tipogrupo.hasMany(Perfil, { as: "tipogrupo", foreignKey: "tipogrupoId" });
Perfil.belongsTo(Tipogrupo, { as: "perfiles" });

Tipocontrato.hasMany(Estadoproceso, {
	as: "status",
	foreignKey: "tipocontratoId",
});
Estadoproceso.belongsTo(Tipocontrato, { as: "tipocontrato" });

Proceso.hasOne(Estadoproceso, { as: "status", foreignKey: "procesoId" });
Estadoproceso.belongsTo(Proceso, { as: "tramites" });

Proceso.hasOne(Pedido, { as: "pedidos", foreignKey: "pedidosId" });
Pedido.belongsTo(Proceso, { as: "tramites" });

Proceso.hasOne(Aprobar, { as: "aprobar", foreignKey: "procesoId" });
Aprobar.belongsTo(Proceso, { as: "tramites" });

Proceso.hasOne(Solicitud_Proceso, {
	as: "solicitud",
	foreignKey: "solicitudId",
});
Solicitud_Proceso.belongsTo(Proceso, { as: "tramites" });

//Modelo.hasMany(Equipos,{as:"categoria",foreignKey:"modeloId"});
//Modelo.hasMany(Equipos,{as:"equipos",foreignKey:"equipoId"});
/* RELACION DE EQUIPOS */

Tipomuestra.hasMany(Envase, { as: "envase", foreignKey: "tipomuestraId" });
Envase.belongsTo(Tipomuestra, { as: "muestra" });

Equipocomplementario.hasMany(Accesorio, {
	as: "acc",
	foreignKey: "equipocomplementarioId",
});
Accesorio.belongsTo(Equipocomplementario, { as: "equipocomplementarios" });

/* inicio relacion equiops */
Usuario.hasMany(Equipos, { as: "equipos", foreignKey: "usuarioId" });
Equipos.belongsTo(Usuario, { as: "usuario" });

Marca.hasMany(Equipos, { as: "equipos", foreignKey: "marcaId" });
Equipos.belongsTo(Marca, { as: "marca" });

Modelo.hasMany(Equipos, { as: "equipos", foreignKey: "modeloId" });
Equipos.belongsTo(Modelo, { as: "modelo" });

Analizador.hasMany(Equipos, { as: "equipos", foreignKey: "analizadorId" });
Equipos.belongsTo(Analizador, { as: "instrumento" });

/* Estado.hasMany(Equipos, { as: "equipos", foreignKey: "estadoId" });
Equipos.belongsTo(Estado, { as: "estado" }); */

Estadofinancieroproveedor.hasMany(Equipos, {
	as: "equipos",
	foreignKey: "estadoproveedorId",
});
Equipos.belongsTo(Estadofinancieroproveedor, { as: "estadoproveedor" });

Estadofinancierocliente.hasMany(Equipos, {
	as: "equipos",
	foreignKey: "estadoclienteId",
});
Equipos.belongsTo(Estadofinancierocliente, { as: "estadocliente" });

/* Ubicacion.hasMany(Equipos, { as: "equipos", foreignKey: "ubicacionId" });
Equipos.belongsTo(Ubicacion, { as: "ubicacion" }); */

Equipos.hasMany(Historicoubicacion, {
	as: "historicoubicacion",
	foreignKey: "equipoId",
});
Historicoubicacion.belongsTo(Equipos, { as: "equipos" });

Equipos.hasMany(Historicoestado, {
	as: "historicoestado",
	foreignKey: "equipoId",
});
Historicoestado.belongsTo(Equipos, { as: "equipos" });

/* fin relaciones equipos */

Ubicacion.hasMany(Historicoubicacion, {
	as: "historicoubicacion",
	foreignKey: "ubicacionId",
});
Historicoubicacion.belongsTo(Ubicacion, { as: "ubicacion" });

Estado.hasMany(Historicoestado, {
	as: "historicoestado",
	foreignKey: "estadoId",
});
Historicoestado.belongsTo(Estado, { as: "estado" });

Solicitud_Proceso.hasMany(Itemequipo, {
	as: "itemequipo",
	foreignKey: "itemequipoId",
});
Itemequipo.belongsTo(Solicitud_Proceso, { as: "solicitud" });

Equipos.hasMany(Accesorio, { as: "acc", foreignKey: "equipoId" });
Accesorio.belongsTo(Equipos, { as: "equipo" });
/* Usuario.hasMany(Proceso,{as:"usuario" ,foreignKey:"usuarioId"});
Proceso.belongsTo(Usuario,{as:"tramites"}) */

Usuario.hasMany(Pedido, { as: "pedidos", foreignKey: "usuarioId" });
Pedido.belongsTo(Usuario, { as: "usuario" });

Usuario.hasMany(PedidoStock, { as: "pedidostock", foreignKey: "usuarioId" });
PedidoStock.belongsTo(Usuario, { as: "usuario" });

Cliente.hasMany(Pedido, { as: "pedidos", foreignKey: "clienteId" });
Pedido.belongsTo(Cliente, { as: "clientes" });

Marca.hasMany(Pedido, { as: "pedidos", foreignKey: "marcaId" });
Pedido.belongsTo(Marca, { as: "marcas" });

Pedido.hasMany(Itempedido, { as: "items", foreignKey: "pedidoId" });
Itempedido.belongsTo(Pedido, { as: "pedidos" });

PedidoStock.hasMany(Itempedidostock, {
	as: "itemstock",
	foreignKey: "pedidostockId",
});
Itempedidostock.belongsTo(PedidoStock, { as: "pedidostock" });

Producto.hasMany(Itempedido, { as: "items", foreignKey: "productoId" });
Itempedido.belongsTo(Producto, { as: "product" });

Producto.hasMany(Itempedidostock, {
	as: "itemstock",
	foreignKey: "productoId",
});
Itempedidostock.belongsTo(Producto, { as: "product" });

Cabecera.hasMany(Detalle, { as: "pruebas", foreignKey: "cabeceraId" });
Detalle.belongsTo(Cabecera, { as: "pacientes" });

Stock.hasMany(ItemStock, { as: "stockItem", foreignKey: "stockId" });
ItemStock.belongsTo(Stock, { as: "inventario" });

Producto.hasMany(ItemStock, { as: "stockItem", foreignKey: "productoId" });
ItemStock.belongsTo(Producto, { as: "product" });

//ItemStock.belongsTo(Producto, { foreignKey: "productoId", as: "product" });

Cabecera_Agen.hasMany(Detalle_Agen, { as: "as400", foreignKey: "cabeceraId" });
Detalle_Agen.belongsTo(Cabecera_Agen, { as: "personas" });
Cabecera.hasMany(Tubo, { as: "tubos", foreignKey: "pacientesId" });
Tubo.belongsTo(Cabecera, { as: "pacientes" });
Tubo.hasMany(Envase, { as: "envase", foreignKey: "tuboId" });
Envase.belongsTo(Tubo, { as: "tubos" });
