var socket;
var options = {
  port: process.env.PORT || 2000,
  host: process.env.HOST || 'localhost',
};
var newMessage = function (name, socket, message) {
  if (!socket || !message) {
    return false;
  }
  name = name || "";
  var msgObj = {id: socket.id, name: name};
  if (message.data) {
    msgObj.messageData = message.data;
  }
  if (message.function) {
    msgObj.messageFuntion = message.function;
  }
  if (!message.data || message.function) {
    msgObj.messageData = message;
  }
  msgObj.sendTime = Date.now();

  return msgObj;
};

var log = function () {
  console.log('log', arguments);
};

var timeDiff = -1;
var timeSync = function (serverTime) {
  timeDiff = (timeDiff + serverTime - Date.now()) / 2;
  console.log('timeDiff', timeDiff);
};

socket = require('socket.io-client')('http://' + options.host + ':' + options.port);
socket.on('connect', function () {
  console.log('socket.id', socket.id);
  socket.emit('newClient', socket.id);
  socket.emit('newWorker', socket.id);
  socket.on('time', timeSync);
  socket.on('chat message', log);
  socket.on('privateMessage', log);
  socket.on('disconnect', log);
  socket.on('execFunction', function (obj) {
    execFunction(obj.id, obj.fn);
  });
});
var next = function (socket, id, result) {
  console.log('next', socket, id, result);
  socket.emit('execResult', socket, id, result);
};
var err = function (id, stack) {
  console.log('error', id, stack);
  socket.emit('execError', id, stack);
};

/**
 * @param {String} id Function to exec
 * @param {Function} fn Function to exec
 */
var execFunction = function (id, fn) {
  fn = new Function('return ' + fn)();
  var result = null;
  try {
    result = fn();
  }
  catch (e) {
    err(id, e.stack);
    return;
  }
  next(socket, id, result);
};
var t = 0;
/** == MAIN == **/
var chat = function () {
  t += 1;
  socket.emit('chat message', newMessage(null, socket, {data: 'hallo ' + t}));
};
setInterval(chat, 500);
//setTimeout(chat, 1500);
setTimeout(function () {
  //socket.emit('test', socket.id);
}, 2000);


setTimeout(function () {
  process.exit(0);
}, 8000);