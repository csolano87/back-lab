const { Socket } = require("socket.io");

/* const conectar =(cliente)=>{
    cliente.on('connect',()=>{
        console.log('Cliente conectado');
    });
} */

const desconectar = (cliente) => {
  cliente.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
};
/* const mensaje = ( cliente ) => {

    cliente.on('mensaje', (  payload ) => {

        console.log('Mensaje recibido', payload );

        io.emit('mensaje-nuevo', payload );

    });
} */
module.exports = { desconectar };
