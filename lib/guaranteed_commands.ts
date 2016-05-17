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

    public findAndResolve(msg, clientMsgId) {
        var command = this.find(clientMsgId);
        if (command) {
            this.delete(command);
            command.done(msg);
            return true;
        }
    }

    private find(clientMsgId) {
        return this.openCommands.find(function (command) {
            return command.msg.clientMsgId === clientMsgId;
        });
    }

    private delete(command) {
        var index = this.openCommands.indexOf(command);
        this.openCommands.splice(index, 1);
    }
}
