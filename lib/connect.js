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
    this.codec = params.codec;

    this.init();
};

util.inherits(Connect, EventEmitter);

Connect.prototype.init = function () {
    var
        adapter = this.adapter,
        onOpen = this.onOpen.bind(this),
        onData = this.onData.bind(this),
        onEnd = this.onEnd.bind(this),
        send = adapter.send.bind(adapter),
        state = new State();

    adapter.onOpen(onOpen);
    adapter.onEnd(onEnd);

    this.state = state;
    this.guaranteedCommands = new GuaranteedCommands({
        state: state,
        send: send
    });
    this.commands = new Commands({
        state: state,
        send: send
    });
    this.codec.decode(
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

Connect.prototype.sendGuaranteedCommand = function (payloadType, payload) {
    var
        clientMsgId = hat(),
        data = this.codec.encode(payloadType, payload, clientMsgId);

    return this.guaranteedCommands.create({
        payload: data,
        clientMsgId: clientMsgId
    });
};

Connect.prototype.sendCommand = function (payloadType, payload) {
    var
        clientMsgId = hat(),
        data = this.codec.encode(payloadType, payload, clientMsgId);

    return this.commands.create({
        payload: data,
        clientMsgId: clientMsgId
    });
};

Connect.prototype.onMessage = function (payloadType, payload, clientMsgId) {
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
