import {Command} from './command';
import {State} from './state';

export class Commands {

    public state: State;
    public send: any;
    public openCommands: any;

    constructor(params: any) {
        this.state = params.state;
        this.send = params.send;
        this.openCommands = [];
    }

    public create(msg: any) {
        var command = new Command(msg);

        this.openCommands.push(command);

        if (this.state.isConnected()) {
            this.send(msg);
        } else {
            command.fail();
        }
        return command;
    }

    public findAndResolve(msg: any, clientMsgId: string) {
        var command = this.find(clientMsgId);
        if (command) {
            this.delete(command);
            command.done(msg);
            return true;
        }
    }

    public fail() {
        this.openCommands.forEach(function (command) {
            command.fail();
        });
    }

    public find(clientMsgId: string) {
        return this.openCommands.find(function (command) {
            return command.msg.clientMsgId === clientMsgId;
        });
    }

    public delete(command: Command) {
        var index = this.openCommands.indexOf(command);
        this.openCommands.splice(index, 1);
    }
}
