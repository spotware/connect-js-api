'use strict';

var Socket = require('ws');

var AdapterWebSocket = function (params) {
    this.socket = undefined;
    this.url = params.url;
};

AdapterWebSocket.prototype.connect = function () {
    var socket = new Socket(this.url);
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
