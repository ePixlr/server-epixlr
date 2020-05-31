require('dotenv/config')
const http = require("http");
const app = require("./src/app");
const connect = require("./src/DBConnect");

connect();
const server = http.createServer(app);
const port = process.env.PORT || 7000;
server.listen(port, () => {
    console.log(`Server Listening at PORT: ${port}`);
});
