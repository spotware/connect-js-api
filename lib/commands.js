'use strict';

var Command = require('./command');

var Commands = function (params) {
    this.state = params.state;
    this.send = params.send;
    this.openCommands = [];
};

Commands.prototype.create = function (params) {
    var
        clientMsgId = params.clientMsgId,
        payload = params.payload,
        openCommands = this.openCommands,
        state = this.state,
        command = new Command({
            clientMsgId: clientMsgId
        });

    state.isConnected()
        ?
            function () {
                openCommands.push(command);
                send(payload);
            }()
        :
            command.fail();

    return command.promise;
};

Commands.prototype.extract = function (clientMsgId) {
    var openCommands = this.openCommands;
    var openCommandsLength = openCommands.length;
    var command;
    var index = 0;
    while (index < openCommandsLength) {
        command = openCommands[index];
        if (command.clientMsgId === clientMsgId) {
            openCommands.splice(index, 1);
            return command;
        }
        index += 1;
    }
};

Commands.prototype.fail = function () {
    var openCommands = this.openCommands;
    for (var i = 0; i < openCommands.length; i += 1) {
        openCommands.pop().fail();
    }
};

module.exports = Commands;
