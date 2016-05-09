export class GuaranteedCommand {

    private msg: any;
    private promise: Promise<any>;
    private resolve: any;

    constructor(msg: any) {
        this.msg = msg;
        this.promise = new Promise((resolve) => {
            this.resolve = resolve;
        });
    }

    public done(msg: any) {
        this.resolve(msg);
        this.destroy();
    }

    public destroy() {
        delete this.msg;
        delete this.resolve;
    }
}
