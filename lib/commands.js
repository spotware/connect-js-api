"use strict";
var command_1 = require('./command');
var Commands = (function () {
    function Commands(params) {
        this.state = params.state;
        this.send = params.send;
        this.openCommands = [];
    }
    Commands.prototype.create = function (msg) {
        var openCommands = this.openCommands;
        var command = new command_1.Command(msg);
        openCommands.push(command);
        if (this.state.isConnected()) {
            this.send(msg);
        }
        else {
            command.fail(undefined);
            openCommands.splice(openCommands.indexOf(command), 1);
        }
        return command.promise;
    };
    Commands.prototype.fail = function () {
        var openCommands = this.openCommands;
        var command;
        for (var i = 0; i < openCommands.length; i += 1) {
            command = openCommands.pop();
            command.fail();
        }
    };
    Commands.prototype.extract = function (clientMsgId) {
        var openCommands = this.openCommands;
        var openCommandsLength = openCommands.length;
        var command;
        var index = 0;
        while (index < openCommandsLength) {
            var command = openCommands[index];
            if (command.msg.clientMsgId === clientMsgId) {
                openCommands.splice(index, 1);
                return command;
            }
            index += 1;
        }
    };
    return Commands;
}());
exports.Commands = Commands;
//# sourceMappingURL=commands.js.map