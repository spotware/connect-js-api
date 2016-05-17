"use strict";
var guaranteed_command_1 = require('./guaranteed_command');
var GuaranteedCommands = (function () {
    function GuaranteedCommands(params) {
        this.state = params.state;
        this.send = params.send;
        this.openCommands = [];
    }
    GuaranteedCommands.prototype.create = function (msg) {
        var command = new guaranteed_command_1.GuaranteedCommand(msg);
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
    return GuaranteedCommands;
}());
exports.GuaranteedCommands = GuaranteedCommands;
//# sourceMappingURL=guaranteed_commands.js.map