import { EventEmitter } from 'events';
export declare class State {
    private value;
    constructor();
    disconnected(): void;
    connected(): void;
    isConnected(): boolean;
}
export declare class GuaranteedCommand {
    private msg;
    promise: JQueryDeferred<any>;
    constructor(msg: any);
    done(msg: any): void;
    private destroy();
}
export declare class GuaranteedCommands {
    private state;
    private send;
    private openCommands;
    constructor(params: any);
    create(msg: any): JQueryDeferred<any>;
    resend(): void;
    extract(clientMsgId: string): any;
}
export declare class Command {
    private msg;
    promise: JQueryDeferred<any>;
    constructor(msg: any);
    done(respond: any): void;
    fail(): void;
    private destroy();
}
export declare class Commands {
    private state;
    private send;
    private openCommands;
    constructor(params: any);
    create(msg: any): JQueryDeferred<any>;
    fail(): void;
    extract(clientMsgId: string): any;
}
export interface IConnectionParams {
    adapter: any;
    encodeDecode: any;
    protocol: any;
}
export declare class Connect extends EventEmitter {
    private adapter;
    private encodeDecode;
    private protocol;
    private state;
    private guaranteedCommands;
    private commands;
    constructor(params: IConnectionParams);
    setAdapter(adapter: any): void;
    private initialization();
    start(): JQueryDeferred<{}>;
    private onData(data);
    private onOpen();
    sendGuaranteedCommand(payloadType: any, params: any): JQueryDeferred<any>;
    sendCommand(payloadType: any, params: any): JQueryDeferred<any>;
    private send(msg);
    private onMessage(data);
    protected isError(payloadType: any): boolean;
    protected processMessage(msg: any, clientMsgId: string, payloadType: number): void;
    protected processPushEvent(msg: any, payloadType: any): void;
    private _onEnd(e);
    isDisconnected(): boolean;
    isConnected(): boolean;
    onConnect(): void;
    onEnd(e: any): void;
}
