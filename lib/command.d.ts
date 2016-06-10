export declare class Command {
    private msg;
    promise: JQueryDeferred<any>;
    constructor(msg: any);
    done(respond: any): void;
    fail(respond: any): void;
    private destroy();
}
