'use strict';

var EventEmitter = require('events');
var State = require('./state');
var util = require('util');
var GuaranteedCommands = require('./guaranteed_commands');
var Commands = require('./commands');

var Connect = function (params) {
    EventEmitter.call(this);

    this.adapter = params.adapter;
    this.encodeDecode = params.encodeDecode;
    this.protocol = params.protocol;

    this.init();
};

util.inherits(Connect, EventEmitter);

Connect.prototype.init = function () {
    this.socket = undefined;
    this.startTime = undefined;
    this.pingInterval = undefined;
    this.state = new State();
    this.guaranteedCommands = new GuaranteedCommands({
        state: this.state,
        send: this.send.bind(this)
    });
    this.commands = new Commands({
        state: this.state,
        send: this.send.bind(this)
    });

    this.encodeDecode.registerDecodeHandler(
        this.onMessage.bind(this)
    );
};

Connect.prototype.start = function () {
    var adapter = this.adapter;

    adapter.onOpen = this.onOpen.bind(this);
    adapter.onData = this.onData.bind(this);
    adapter.onError = adapter.onEnd = this._onEnd.bind(this);

    adapter.connect();
};

Connect.prototype.onData = function (data) {
    this.encodeDecode.decode(data);
};

Connect.prototype.onOpen = function () {
    this.startTime = new Date();
    this.state.connected();

    this.guaranteedCommands.resend();
    this.onConnect();
};

Connect.prototype.sendGuaranteedCommand = function (payloadType, params) {
    return this.guaranteedCommands.create(
        this.protocol.encode(payloadType, params)
    );
};

Connect.prototype.sendCommand = function (payloadType, params) {
    return this.commands.create(
        this.protocol.encode(payloadType, params)
    );
};

Connect.prototype.send = function (msg) {
    var data = this.encodeDecode.encode(msg);
    this.adapter.send(data);
};

Connect.prototype.onMessage = function (data) {
    data = this.protocol.decode(data);
    var msg = data.msg;
    var payloadType = data.payloadType;
    var clientMsgId = data.clientMsgId;

    if (clientMsgId) {
        this.processMessage(msg, clientMsgId);
    } else {
        this.processPushEvent(msg, payloadType);
    }
};

Connect.prototype.processMessage = function (msg, clientMsgId) {
    return this.guaranteedCommands.findAndResolve(msg, clientMsgId) || this.commands.findAndResolve(msg, clientMsgId);
};

Connect.prototype.processPushEvent = function (msg, payloadType) {
    this.emit(payloadType, msg);
};

Connect.prototype._onEnd = function (e) {
    this.state.disconnected();
    this.commands.fail();
    this.onEnd(e);
};

Connect.prototype.onConnect = function () {};

Connect.prototype.onEnd = function () {};

module.exports = Connect;
