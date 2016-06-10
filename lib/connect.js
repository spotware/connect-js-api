'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var state_1 = require('./state');
var guaranteed_commands_1 = require('./guaranteed_commands');
var commands_1 = require('./commands');
var Connect = (function (_super) {
    __extends(Connect, _super);
    function Connect(params) {
        _super.call(this);
        this.encodeDecode = params.encodeDecode;
        this.protocol = params.protocol;
        this.initialization();
    }
    Connect.prototype.getAdapter = function () {
        return this.adapter;
    };
    Connect.prototype.setAdapter = function (adapter) {
        this.adapter = adapter;
    };
    Connect.prototype.initialization = function () {
        this.state = new state_1.State();
        this.guaranteedCommands = new guaranteed_commands_1.GuaranteedCommands({
            state: this.state,
            send: this.send.bind(this)
        });
        this.commands = new commands_1.Commands({
            state: this.state,
            send: this.send.bind(this)
        });
        this.encodeDecode.registerDecodeHandler(this.onMessage.bind(this));
    };
    Connect.prototype.start = function () {
        var _this = this;
        var def = $.Deferred();
        var adapter = this.adapter;
        adapter.onOpen = function () {
            _this.onOpen();
            def.resolve();
        };
        adapter.onData = this.onData.bind(this);
        adapter.onError = adapter.onEnd = function (e) {
            def.reject();
            _this._onEnd(e);
        };
        adapter.connect();
        return def.promise();
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
        return this.guaranteedCommands.create(this.protocol.encode(payloadType, params));
    };
    Connect.prototype.sendCommand = function (payloadType, params) {
        return this.commands.create(this.protocol.encode(payloadType, params));
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
            var command = this.guaranteedCommands.extract(clientMsgId) || this.commands.extract(clientMsgId);
            if (command) {
                if (this.isError(payloadType)) {
                    command.fail(msg);
                }
                else {
                    command.done(msg);
                }
                return;
            }
        }
        this.processPushEvent(msg, payloadType);
    };
    Connect.prototype.isError = function (payloadType) {
        return false;
    };
    Connect.prototype.processMessage = function (msg, clientMsgId, payloadType) {
    };
    Connect.prototype.processPushEvent = function (msg, payloadType) {
        this.emit(payloadType, msg);
    };
    Connect.prototype._onEnd = function (e) {
        this.state.disconnected();
        this.commands.fail();
        this.onEnd(e);
    };
    Connect.prototype.isDisconnected = function () {
        return !this.state.isConnected();
    };
    Connect.prototype.isConnected = function () {
        return this.state.isConnected();
    };
    Connect.prototype.onConnect = function () { };
    Connect.prototype.onEnd = function (e) { };
    return Connect;
}(events_1.EventEmitter));
exports.Connect = Connect;
//# sourceMappingURL=connect.js.map