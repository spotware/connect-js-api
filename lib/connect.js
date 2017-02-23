'use strict';

var EventEmitter = require('events');
var State = require('./state');
var util = require('util');
var GuaranteedCommands = require('./guaranteed_commands');
var Commands = require('./commands');
var hat = require('hat');

var Connect = function (params) {
    EventEmitter.call(this);

    this.adapterStream = params.adapterStream;
    this.encodeDecode = params.encodeDecode;
    this.protocol = params.protocol;

    this.init();
};

util.inherits(Connect, EventEmitter);

Connect.prototype.init = function () {
    var setAdapter = function (adapter) {
        this.adapter = adapter;
    };
    this.socket = undefined;
    this.state = new State();
    this.guaranteedCommands = new GuaranteedCommands({
        state: this.state,
        send: this.send.bind(this)
    });
    this.commands = new Commands({
        state: this.state,
        send: this.send.bind(this)
    });
    this.adapterStream.subscribe(setAdapter.bind(this));
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
    this.state.connected();

    this.guaranteedCommands.resend();
    this.onConnect();
};

Connect.prototype.sendGuaranteedCommand = function (payloadType, params) {
    var clientMsgId = hat();
    var msg = this.protocol.encode(payloadType, params, clientMsgId);

    return this.guaranteedCommands.create({
        clientMsgId: clientMsgId,
        msg: msg
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
    var msg = data.msg;
    var payloadType = data.payloadType;
    var clientMsgId = data.clientMsgId;

    if (clientMsgId) {
        this.processData(clientMsgId, payloadType, msg);
    } else {
        this.processPushEvent(msg, payloadType);
    }
};

Connect.prototype.processData = function (clientMsgId, payloadType, msg) {
    var command = this.extractCommand(clientMsgId);
    if (command) {
        this.processMessage(command, msg, payloadType);
    } else {
        this.processPushEvent(msg, payloadType);
    }
};

Connect.prototype.extractCommand = function (clientMsgId) {
    return this.guaranteedCommands.extract(clientMsgId) || this.commands.extract(clientMsgId);
};

Connect.prototype.processMessage = function (command, msg, payloadType) {
    if (this.isError(payloadType)) {
        command.fail(msg);
    } else {
        command.done(msg);
    }
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

Connect.prototype.isError = function (payloadType) {
    //Overwrite this method by your buisness logic
    return false;
};

module.exports = Connect;
