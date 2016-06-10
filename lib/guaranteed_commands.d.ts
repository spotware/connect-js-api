export declare class GuaranteedCommands {
    private state;
    private send;
    private openCommands;
    constructor(params: any);
    create(msg: any): JQueryDeferred<any>;
    resend(): void;
    extract(clientMsgId: string): any;
}
