export declare class GuaranteedCommand {
    private msg;
    promise: JQueryDeferred<any>;
    constructor(msg: any);
    done(msg: any): void;
    private destroy();
}
