export class Command {

    private msg: any;
    private promise: Promise<any>;
    private resolve: any;
    private reject: any;

    constructor(msg: any) {
        this.msg = msg;
        this.promise = new Promise((resolve: any, reject: any) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    public done(respond: any) {
        this.resolve(respond);
        this.destroy();
    }

    public fail() {
        this.reject();
        this.destroy();
    }

    public destroy() {
        delete this.msg;
        delete this.resolve;
        delete this.reject;
    }
}
