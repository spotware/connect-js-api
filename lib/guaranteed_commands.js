'use strict';

var GuaranteedCommand = require('./guaranteed_command');

var GuaranteedCommands = function (params) {
    this.state = params.state;
    this.send = params.send;
    this.openCommands = [];
};

GuaranteedCommands.prototype.create = function (msg) {
    var command = new GuaranteedCommand(msg);

    this.openCommands.push(command);

    if (this.state.isConnected()) {
        this.send(msg);
    }
    return command.promise;
};

GuaranteedCommands.prototype.resend = function () {
    this.openCommands
        .map(function (command) {
            return command.msg;
        })
        .forEach(this.send);
};

GuaranteedCommands.prototype.findAndResolve = function (msg, clientMsgId) {
    var command = this.find(clientMsgId);
    if (command) {
        this.delete(command);
        command.done(msg);
        return true;
    }
};

GuaranteedCommands.prototype.find = function (clientMsgId) {
    return this.openCommands.find(function (command) {
        return command.msg.clientMsgId === clientMsgId;
    });
};

GuaranteedCommands.prototype.delete = function (command) {
    var index = this.openCommands.indexOf(command);
    this.openCommands.splice(index, 1);
};

module.exports = GuaranteedCommands;
