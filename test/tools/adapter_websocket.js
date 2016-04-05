'use strict';

var Socket = require('ws');

var AdapterWebSocket = function (params) {
    this.socket = undefined;
    this.host = params.host;
    this.port = params.port;
};

AdapterWebSocket.prototype.connect = function () {
    var url = [this.host, this.port].join(':');
    var socket = new Socket('wss://' + url);
    this.socket = socket;
    socket.onopen = this.onOpen;
    socket.onmessage = function (message) {
        this.onData(message.data);
    }.bind(this);

    socket.onclose = this.onEnd;
    socket.onerror = this.onError;
};

AdapterWebSocket.prototype.send = function (data) {
    this.socket.send(data);
};

module.exports = AdapterWebSocket;
