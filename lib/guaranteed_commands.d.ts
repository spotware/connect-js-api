export declare class GuaranteedCommands {
    private state;
    private send;
    private openCommands;
    constructor(params: any);
    create(msg: any): JQueryDeferred<any>;
    resend(): void;
    findAndResolve(msg: any, clientMsgId: any): boolean;
    private find(clientMsgId);
    private delete(command);
}
