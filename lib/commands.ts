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
        var command = new Command(msg);

        this.openCommands.push(command);

        if (this.state.isConnected()) {
            this.send(msg);
        } else {
            command.fail();
        }
        return command.promise;
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

    private find(clientMsgId: string) {
        return this.openCommands.find(function (command) {
            return command.msg.clientMsgId === clientMsgId;
        });
    }

    private delete(command: Command) {
        var index = this.openCommands.indexOf(command);
        this.openCommands.splice(index, 1);
    }
}
