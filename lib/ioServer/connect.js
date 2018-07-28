const log = function () {
  console.log('log', arguments);
};
const crypto = require("crypto");
const testFunction = require('./test/basic_i');
const newMessage = require('../helper/newMessage.js');

const connect = function (io, clients, worker, rooms) {
  return function (socket) {
    clients[socket.id] = clients[socket.id] || {
        id: socket.id,
        score: 0
      };
    const chat = function (data) {
      for (const prop of Object.keys(data)) {
        if (prop && data[prop]) {
          clients[socket.id][prop] = data[prop];
        }
      }
      io.emit('chat message', newMessage('server', io, {data: data}));

    };
    const disconnect = function () {
      delete clients[socket.id];
      io.emit('clients', clients);
      console.log('user disconnected');
    };
    socket.on('newClient', function () {
      log(arguments);
      io.emit('clients', clients);
    });
    socket.on('chat message', chat);
    socket.on('newData', log);
    //socket.on('time', log);
    socket.on('disconnect', disconnect);

    //** PERSONAL **//
    socket.on('sendDataToId', function (id, msg, from) {
      socket.broadcast.to(id).emit('privateMessage', id, msg, from);
    });

    //** ROOM **//
    socket.on('joinRoom', function (name) {
      rooms.push(name);
      rooms.sort(function (a, b) {
        return a.localeCompare(b);
      });
      rooms = rooms.unique();
      console.log(socket.id, 'joining', name);
      socket.join(name);
      io.emit('roomList', rooms);
      setTimeout(function () {
        io.to(socket.id).emit('changeRoomTo', name);
        console.log(socket.id, 'changeRoomTo', name);
      }, 600);
    });

    socket.on('leaveRoom', function (name) {
      socket.leave(name);
    });
    socket.on('sendDataToRoom', function (name, msg) {
      io.to(name).emit('roomMessage', msg);
    });

    //** WORKER **//
    socket.on('newWorker', function (id) {
      worker[id] = socket;
    });

    socket.on('test', function (id) {
      console.log(id, worker[id].id);
      io.to(worker[id].id).emit('execFunction', {
        id: crypto.randomBytes(16).toString('hex'),
        fn: testFunction.toString()
      });
    });
    socket.on('execResult', function (socketId, id, result) {
      if (socketId && id && result) {
        clients[socketId].score += 10;
        // todo save result for id
      }
    });
    socket.on('execError', function (id, errorStack) {
      // todo mark job as executed with error, save stack
    });
    // socket.to(<socketid>).emit('hey', 'I just met you');
    io.emit('clients', clients);
  }
};
module.exports = connect;