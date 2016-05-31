import {GuaranteedCommand} from './guaranteed_command';
import {State} from './state';

export class GuaranteedCommands {

    private state: State;
    private send: any;
    private openCommands: any;

    constructor(params: any) {
        this.state = params.state;
        this.send = params.send;
        this.openCommands = [];
    }

    public create(msg: any): JQueryDeferred<any> {
        var command = new GuaranteedCommand(msg);

        this.openCommands.push(command);

        if (this.state.isConnected()) {
            this.send(msg);
        }
        return command.promise;
    }

    public resend() {
        this.openCommands
            .map(function (command) {
                return command.msg;
            })
            .forEach(this.send);
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
