export class Command {

    private msg: any;
    public promise: JQueryDeferred<any>;

    constructor(msg: any) {
        this.msg = msg;
        this.promise = $.Deferred();
    }

    public done(respond: any) {
        this.promise.resolve(respond);
        this.destroy();
    }

    public fail() {
        this.promise.reject();
        this.destroy();
    }

    private destroy() {
        delete this.msg;
    }
}
