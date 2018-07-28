const log = function () {
  console.log('log', arguments);
};
const connect = require('./connect');

const ioServer = function (server) {
  const io = require('socket.io')(server);
  const clients = {};
  const worker = {};
  let rooms = ['Lobby'];
  io.on('connection', connect(io, clients, worker, rooms));
  const roomsListUpdate = setInterval(function () {
    io.emit('roomList', rooms);
  }, 2000);
  const time = setInterval(function () {
    io.emit('time', Date.now());
  }, 2000);
  return {
    io: io,
    rooms: rooms,
    clients: clients,
    worker: worker,
    interval: {
      roomsListUpdate: roomsListUpdate,
      time: time,
    },
  };
};
module.exports = ioServer;