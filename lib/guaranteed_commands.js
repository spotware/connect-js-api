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
    GuaranteedCommands.prototype.extract = function (clientMsgId) {
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
    return GuaranteedCommands;
}());
exports.GuaranteedCommands = GuaranteedCommands;
//# sourceMappingURL=guaranteed_commands.js.map