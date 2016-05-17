export class State {

    private value: boolean;

    constructor() {
        this.disconnected();
    }

    public disconnected(): void {
        this.value = false;
    }

    public connected(): void {
        this.value = true;
    }

    public isConnected(): boolean {
        return this.value;
    }

}
