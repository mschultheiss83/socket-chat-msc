var socket = null;
var socketId = null;
var df = null;

$(function () {
  socket = io();
  socket.on('connect', function () {
    socketId = socket.id;
    df = DashManager({
      id: socketId,
      socket: socket
    });
    df.init();
    socket.on('changeRoomTo', function (name) {
      df.changeRoomTo(name);
    });
    socket.on('clients', function (clients) {
      df.updateClients(clients);
    });
    socket.on('roomList', function (rooms) {
      df.buildRoomList(rooms)
    });
    socket.on('chat message', function (data) {
      df.builder.messageReceiver(data)
    });
    socket.on('log', function () {
      console.log(arguments);
    });
  });
});
