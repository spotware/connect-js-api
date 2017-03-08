'use strict';

var EventEmitter = require('events');
var State = require('./state');
var util = require('util');
var GuaranteedCommands = require('./guaranteed_commands');
var Commands = require('./commands');
var hat = require('hat');

var Connect = function (params) {
    EventEmitter.call(this);

    this.adapter = params.adapter;
    this.encodeDecode = params.encodeDecode;
    this.protocol = params.protocol;

    this.init();
};

util.inherits(Connect, EventEmitter);

Connect.prototype.init = function () {
    var
        adapter = this.adapter,
        onOpen = this.onOpen.bind(this),
        onData = this.onData.bind(this),
        onEnd = this.onEnd.bind(this);

    adapter.onOpen(onOpen);
    adapter.onData(onData);
    adapter.onError(onEnd);
    adapter.onEnd(onEnd);

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

Connect.prototype.onData = function (data) {
    this.encodeDecode.decode(data);
};

Connect.prototype.onOpen = function () {
    this.state.connected();
    this.guaranteedCommands.resend();
};

Connect.prototype.sendGuaranteedCommand = function (payloadType, params) {
    var clientMsgId = hat();
    var payload = this.protocol.encode(payloadType, params, clientMsgId);

    return this.guaranteedCommands.create({
        clientMsgId: clientMsgId,
        payload: payload
    });
};

Connect.prototype.sendCommand = function (payloadType, params) {
    var clientMsgId = hat();
    var msg = this.protocol.encode(payloadType, params, clientMsgId);

    return this.commands.create({
        clientMsgId: clientMsgId,
        msg: msg
    });
};

Connect.prototype.send = function (data) {
    this.adapter.send(
        this.encodeDecode.encode(data)
    );
};

Connect.prototype.onMessage = function (data) {
    data = this.protocol.decode(data);
    var payload = data.msg;
    var payloadType = data.payloadType;
    var clientMsgId = data.clientMsgId;

    clientMsgId
        ? this.processData(clientMsgId, payloadType, payload)
        : this.processPushEvent(payload, payloadType);
};

Connect.prototype.processData = function (clientMsgId, payloadType, payload) {
    var command = this.extractCommand(clientMsgId);

    command
        ? this.processMessage(command, payload, payloadType)
        : this.processPushEvent(payload, payloadType);
};

Connect.prototype.extractCommand = function (clientMsgId) {
    return this.guaranteedCommands.extract(clientMsgId) || this.commands.extract(clientMsgId);
};

Connect.prototype.processMessage = function (command, payload, payloadType) {
    this.isError(payloadType)
        ? command.fail(payload)
        : command.done(payload);
};

Connect.prototype.processPushEvent = function (payload, payloadType) {
    this.emit(payloadType, payload);
};

Connect.prototype.onEnd = function () {
    this.state.disconnected();
    this.commands.fail();
};

Connect.prototype.isError = function (isErrorpayloadType) {
    //Overwrite this method by your buisness logic
    return false;
};

module.exports = Connect;
