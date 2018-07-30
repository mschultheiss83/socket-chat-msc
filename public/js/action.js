var socket = null;
var socketId = null;
var df = null;
var log = function () {
  console.log(arguments);
};
$(function () {
  socket = io();
  socket.on('connect', function () {
    socketId = socket.id;
    df = DashManager({
      id: socketId,
      socket: socket
    });
    df.init();
    socket.on('changeRoomTo', df.changeRoomTo);
    socket.on('clients', df.updateClients);
    socket.on('roomList', df.buildRoomList);
    socket.on('chat message', df.builder.messageReceiver);
    socket.on('privateMessage', df.builder.privateMessage);
    socket.on('log', log);
  });
});

