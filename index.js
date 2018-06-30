// /**
//  * World's simplest express server
//  * - used to serve index.html from /public
//  */
//
// var express = require('express');
// var serveStatic = require('serve-static');
// var app = express();
// app.use(serveStatic(__dirname + '/public'));
// app.listen(3000);
// // console.log('App listening on port 3000');


const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
