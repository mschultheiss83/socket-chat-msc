const newMessage = function (name, socket, message) {
  if (!socket || !message) {
    return false;
  }
  name = name || "";
  const msgObj = {id: socket.id, name: name};
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
const DashManager = function (config) {
  const _data = {
    id: '',
    currentRoom: 'Lobby',
    roomList: [],
    clientList: {},
    socket: null,
    onceNewClient: false,
  };
  _data.config = config;
  if (config.socket) {
    _data.socket = config.socket;
  }
  if (config.id) {
    _data.id = config.id;
  }
  const builder = function () {
    const buildRoomsListItem = function (ul, name) {
      name = name || 'Lobby';
      var button = $('<a>').addClass('btn').addClass('btn-primary').addClass('octicon-chevron-right').addClass('room-' + name).attr('href', '#').attr('role', 'button').append('go to');
      button.click(function () {
        socket.emit('joinRoom', name);
      });
      var li = $('<li>').attr('id', 'room-' + name).addClass('list-group-item').addClass('list-group-item-action');
      if (_data.currentRoom == name) {
        li.addClass('list-group-item-primary');
      }
      li.append(button);
      li.append('&nbsp;' + name);
      ul.append(li);
    };
    const buildClientListItem = function (ul, name) {
      name = name || socketId;
      var li = $('<li>').attr('id', 'room-' + name).addClass('list-group-item').addClass('list-group-item-action');
      if (_data.currentRoom == name) {
        li.addClass('list-group-item-primary');
      }
      if (name != socketId) {
        var button = $('<a>').addClass('btn').addClass('btn-primary').addClass('octicon-chevron-right').addClass('room-' + name).attr('href', '#').attr('role', 'button').append('send');
        button.click(function () {
          var message = $('#m');
          if (message.val()) {
            socket.emit('sendDataToId', name, message.val(), socketId);
            message.val('');
          }
        });
        li.append(button);
      }
      li.append('&nbsp;' + name);
      ul.append(li);
    };

    return {
      changeRoomTo: function (name) {
        $('#rooms').find('li').each(function (i, e) {
          if ($(e).hasClass('list-group-item-primary')) {
            $(e).removeClass('list-group-item-primary');
          }
        });
        $('#room-' + name).addClass('list-group-item-primary');
      },
      buildRoomsList: function (rooms) {
        var ul = $('<ul>').attr('id', 'rooms').addClass('list-group').addClass('text-left');
        rooms.forEach(function (name) {
          buildRoomsListItem(ul, name);
        });
        $('#rooms').replaceWith(ul);
      },
      buildClientList: function (clients) {
        var ul = $('<ul>').attr('id', 'clients').addClass('list-group').addClass('text-left');
        Object.keys(clients).forEach(function (id) {
          buildClientListItem(ul, id);
        });
        $('#clients').replaceWith(ul);
      },
      messageReceiver: function (data) {
        //console.log(data);
        var name = data.messageData.name || data.messageData.id;
        var sendTime = new Date(data.messageData.sendTime);
        var text = socketId != name ? name + ': ' : 'me: ';
        text += JSON.stringify(data.messageData.messageData) + ' (' + sendTime.toLocaleDateString() + ' ' + sendTime.toLocaleTimeString() + ')';
        var li = $('<li>').text(text);
        li.addClass('list-group-item');
        li.attr('data-message-time', data.messageData.sendTime);
        li.attr('data-message-from', data.messageData.name);
        $('#messages').append(li);
        window.scrollTo(0, document.body.scrollHeight);
      },
      buildRoomsListItem: buildRoomsListItem,
      buildClientListItem: buildClientListItem
    }
  }();
  const room = function (roomName) {
    if (!roomName) {
      return _data.currentRoom;
    }
    else {
      _data.currentRoom = roomName;
    }
  };
  const socket = function (id) {
    if (!id) {
      return _data.id;
    }
    else {
      _data.id = id;
    }
  };
  const timers = {
    cleanMessages: setInterval(function () {
      var removeTime = 1000 * 60 * 5;
      var lis = $('#messages').find('li');
      if (lis && lis.length > 0) {
        var first = lis.first();
        var dataTime = first.attr('data-time');
        var time = Date.now() - dataTime;
        if (lis.length > 5 && time > removeTime) {
          first.fadeOutAndRemove('slow');
        }
      }
    }, 500)
  };
  return {
    init: function () {
      $('form').submit(function () {
        var inputM = $('#m');
        var m = inputM.val();
        var n = socketId; //todo set name?
        var inputR = $('#r');
        var r = inputR.val();

        if (!_data.onceNewClient) {
          _data.socket.emit('newClient', socket.id);
          _data.onceNewClient = true;
        }

        if (m) {
          _data.socket.emit('chat message', newMessage(n, socket, {data: m}));
          inputM.val('');
        }

        if (r) {
          _data.socket.emit('joinRoom', r);
          inputR.val('');
        }

        return false;
      });
    },
    timers: timers,
    room: room,
    socket: socket,
    newMessage: newMessage,
    builder: builder,
    buildRoomList: function (rooms) {
      if (rooms.length != _data.roomList.length || (JSON.stringify(rooms) != JSON.stringify(_data.roomList))) {
        _data.roomList = rooms;
        builder.buildRoomsList(rooms);
      }
    },
    changeRoomTo: function (name) {
      room(name);
      builder.changeRoomTo(name);
    },
    updateClients: function (clients) {
      if (clients.length != _data.clientList.length || (JSON.stringify(clients) != JSON.stringify(_data.clientList))) {
        _data.clientList = clients;
        builder.buildClientList(clients);
      }
    },
    data: _data,
  }
};

