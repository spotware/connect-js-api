import {Command} from './command';
import {State} from './state';

export class Commands {

    private state: State;
    private send: any;
    private openCommands: any;

    constructor(params: any) {
        this.state = params.state;
        this.send = params.send;
        this.openCommands = [];
    }

    public create(msg: any): JQueryDeferred<any> {
        var openCommands = this.openCommands;

        var command = new Command(msg);

        openCommands.push(command);

        if (this.state.isConnected()) {
            this.send(msg);
        } else {
            command.fail(<any>undefined);
            openCommands.splice(openCommands.indexOf(command), 1);
        }
        return command.promise;
    }

    public fail() {
        var openCommands = this.openCommands;
        var command;
        for (var i = 0; i < openCommands.length; i += 1) {
            command = openCommands.pop();
            command.fail();
        }
    }

    public extract(clientMsgId: string): any {
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
    }

}
