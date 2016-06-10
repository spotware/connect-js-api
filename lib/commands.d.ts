export declare class Commands {
    private state;
    private send;
    private openCommands;
    constructor(params: any);
    create(msg: any): JQueryDeferred<any>;
    fail(): void;
    extract(clientMsgId: string): any;
}
