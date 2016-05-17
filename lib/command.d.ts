export declare class Command {
    private msg;
    promise: JQueryDeferred<any>;
    constructor(msg: any);
    done(respond: any): void;
    fail(): void;
    private destroy();
}
