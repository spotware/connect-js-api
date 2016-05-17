export declare class Commands {
    private state;
    private send;
    private openCommands;
    constructor(params: any);
    create(msg: any): JQueryDeferred<any>;
    findAndResolve(msg: any, clientMsgId: string): boolean;
    fail(): void;
    private find(clientMsgId);
    private delete(command);
}
