'use strict';

var Socket = require('ws');
var StateEmitter = require('state-emitter').StateEmitter;

var AdapterWebSocket = function () {
    this.state = new StateEmitter(undefined);
};

AdapterWebSocket.prototype.connect = function (url) {
    var
        ondata = this.ondata,
        state = this.state,
        socket = new Socket(url);

    socket.onmessage = function (message) {
        ondata(message.data);
    };
    socket.onopen = function () {
        state.next(true);
    };
    socket.onclose = function () {
        state.next(false);
    };
    socket.onerror = function () {
        state.next(false);
    };
    this.send = function (data) {
        socket.send(data);
    };
};

AdapterWebSocket.prototype.onOpen = function (onopen) {
    this.state.whenEqual(true, onopen);
};

AdapterWebSocket.prototype.onEnd = function (onend) {
    this.state.whenEqual(false, onend);
};

AdapterWebSocket.prototype.onError = function (onerror) {
    this.state.whenEqual(false, onerror);
};

AdapterWebSocket.prototype.onData = function (ondata) {
    this.ondata = ondata;
};

module.exports = AdapterWebSocket;
