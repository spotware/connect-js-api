import { EventEmitter } from 'events';
export interface IConnectionParams {
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
    getAdapter(): any;
    setAdapter(adapter: any): void;
    private initialization();
    start(): JQueryPromise<void>;
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
