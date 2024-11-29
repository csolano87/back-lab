const Server = require("./models/server");

require("dotenv").config();

//const server = new Server();
const serverInstance = Server.getInstance();

//server.listen();
serverInstance.listen();
