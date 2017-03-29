'use strict';

var
    WebSocket = require('ws'),
    StateEmitter = require('state-emitter').StateEmitter;

module.exports = function (params) {
    var
        ondata,
        socket,
        connected = true,
        disconnected = false,
        state = new StateEmitter();

    return {
        connect: function (url) {
            var
                setDisconnected = function () {
                    state.next(disconnected);
                };

            socket = new WebSocket(url);
            socket.onmessage = function (message) {
                ondata(message.data);
            };
            socket.onopen = function () {
                state.next(connected);
            };
            socket.onend = setDisconnected;
            socket.onerror = setDisconnected;
        },
        send: function (data) {
            socket.send(data);
        },
        onOpen: function (callback) {
            state.whenEqual(connected, callback);
        },
        onEnd: function (callback) {
            state.whenEqual(disconnected, callback);
        },
        onError: function (callback) {
            state.whenEqual(disconnected, callback);
        },
        onData: function (callback) {
            ondata = callback;
        }
    };
};
