'use strict';

var EventEmitter = require('events');
var state = require('./state');
var Command = require('./command');
var util = require('util');
var debug = util.debuglog('Connect');

var Connect = function (params) {
    EventEmitter.call(this);

    this.adapter = params.adapter;
    this.stream = params.stream;
    this.protocol = params.protocol;

    this.init();
};

util.inherits(Connect, EventEmitter);

Connect.prototype.init = function () {
    this.socket = undefined;
    this.startTime = undefined;
    this.pingInterval = undefined;
    this.state = state.disconnect;
    this.openCommands = [];

    this.stream.onDecode = this.onMessage.bind(this);
};

Connect.prototype.start = function () {
    var adapter = this.adapter;

    adapter.onOpen = this.onOpen.bind(this);
    adapter.onData = this.onData.bind(this);
    adapter.onEnd = this._onEnd.bind(this);
    adapter.onError = this._onError.bind(this);

    adapter.connect();
};

Connect.prototype.onData = function (data) {
    this.stream.decode(data);
};

Connect.prototype.onOpen = function () {
    this.startTime = new Date();
    this.state = state.connected;

    this.resendCommands();
    this.onConnect();
};

Connect.prototype.onConnect = function () {};

Connect.prototype.resendCommands = function () {
    this.openCommands.forEach(function (command) {
        this.sendCommand(command.msg.toBuffer());
    }, this);
};

Connect.prototype.sendGuaranteedCommand = function (payloadType, params) {
    var msg = this.protocol.encode(payloadType, params);

    debug(payloadType, msg);

    var command = new Command({msg: msg});

    this.openCommands.push(command);

    if (this.isConnected()) {
        this.sendCommand(msg.toBuffer());
    }
    return command.promise;
};

Connect.prototype.sendCommand = function (msg) {
    var data = this.stream.encode(msg);
    this.adapter.send(data);
};

Connect.prototype.onMessage = function (data) {
    data = this.protocol.decode(data);
    var msg = data.msg;
    var payloadType = data.payloadType;
    var clientMsgId = data.clientMsgId;

    debug(payloadType, msg);

    if (clientMsgId) {
        this.processMessage(msg, clientMsgId);
    } else {
        this.processPushEvent(msg, payloadType);
    }
};

Connect.prototype.processMessage = function (msg, clientMsgId) {
    var command = this.findCommand(clientMsgId);
    command.done(msg);
    this.deleteCommand(command);
};

Connect.prototype.processPushEvent = function (msg, payloadType) {
    this.emit(payloadType, msg);
};

Connect.prototype.findCommand = function (clientMsgId) {
    return this.openCommands.find(function (command) {
        return command.msg.clientMsgId === clientMsgId;
    });
};

Connect.prototype.deleteCommand = function (command) {
    var index = this.openCommands.indexOf(command);
    this.openCommands.splice(index, 1);
};

Connect.prototype._onEnd = function () {
    this.state = state.disconnected;
    this.onEnd();
};

Connect.prototype._onError = function (e) {
    this.state = state.disconnected;
    this.onError(e);
};

Connect.prototype.isConnected = function () {
    return this.state === state.connected;
};

module.exports = Connect;
