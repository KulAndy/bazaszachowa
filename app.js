// var http = require("http");
// var server = http.createServer(function (req, res) {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("hello world!\n");
// });
// server.listen(3000);

const http = require("http");
const ROUTER = require("./app/router");

http
  .createServer((req, res) => ROUTER(req, res))
  .listen(3000, () => console.log("listen on 3000"));
