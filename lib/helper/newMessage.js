function newMessage(name, socket, message) {
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
}

module.exports = newMessage;