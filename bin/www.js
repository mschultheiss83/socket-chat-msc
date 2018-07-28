const app = require('../app');
const http = require('http');
const options = {
  port: parseInt(process.env.PORT, 10) || 2000,
  host: process.env.HOST || 'localhost',
};
app.set('options', options);
const server = http.Server(app);
const ioServer = require('../lib/ioServer/index')(server);
process.send = process.send || function () {};

server.listen(options, function () {
  console.log('listening on', options);
  process.send('ready');
});
