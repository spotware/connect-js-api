export class GuaranteedCommand {

    private msg: any;
    public promise: JQueryDeferred<any>;

    constructor(msg: any) {
        this.msg = msg;
        this.promise = $.Deferred();
    }

    public done(msg: any) {
        this.promise.resolve(msg);
        this.destroy();
    }

    private destroy() {
        delete this.msg;
    }
}
