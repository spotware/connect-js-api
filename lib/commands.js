"use strict";
var command_1 = require('./command');
var Commands = (function () {
    function Commands(params) {
        this.state = params.state;
        this.send = params.send;
        this.openCommands = [];
    }
    Commands.prototype.create = function (msg) {
        var command = new command_1.Command(msg);
        this.openCommands.push(command);
        if (this.state.isConnected()) {
            this.send(msg);
        }
        else {
            command.fail();
        }
        return command.promise;
    };
    Commands.prototype.findAndResolve = function (msg, clientMsgId) {
        var command = this.find(clientMsgId);
        if (command) {
            this.delete(command);
            command.done(msg);
            return true;
        }
    };
    Commands.prototype.fail = function () {
        this.openCommands.forEach(function (command) {
            command.fail();
        });
    };
    Commands.prototype.find = function (clientMsgId) {
        return this.openCommands.find(function (command) {
            return command.msg.clientMsgId === clientMsgId;
        });
    };
    Commands.prototype.delete = function (command) {
        var index = this.openCommands.indexOf(command);
        this.openCommands.splice(index, 1);
    };
    return Commands;
}());
exports.Commands = Commands;
//# sourceMappingURL=commands.js.map