'use strict';

var tls = require('tls');

var AdapterTLS = function (params) {
    this.host = params.host;
    this.port = params.port;
    this.socket = undefined;
};

AdapterTLS.prototype.connect = function () {
    var socket = tls.connect(this.port, this.host, this.onOpen);

    socket.on('data', this.onData);
    socket.on('end', this.onEnd);
    socket.on('error', this.onError);

    this.socket = socket;
};

AdapterTLS.prototype.send = function (data) {
    this.socket.write(data);
};

module.exports = AdapterTLS;
