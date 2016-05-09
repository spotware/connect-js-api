'use strict';

import {EventEmitter} from 'events';

import {State} from './state';
import {GuaranteedCommands} from './guaranteed_commands';
import {Commands} from './commands';

export class Connect extends EventEmitter {

    private adapter: any;
    private encodeDecode: any;
    private protocol: any;
    private state: State;
    private guaranteedCommands: GuaranteedCommands;
    private commands: Commands;

    constructor(params: any) {
        super()

        this.adapter = params.adapter;
        this.encodeDecode = params.encodeDecode;
        this.protocol = params.protocol;

        this.init();
    }

    public setAdapter(adapter: any) {
        this.adapter = adapter;
    }

    public init() {
        this.state = new State();
        this.guaranteedCommands = new GuaranteedCommands({
            state: this.state,
            send: this.send.bind(this)
        });
        this.commands = new Commands({
            state: this.state,
            send: this.send.bind(this)
        });

        this.encodeDecode.registerDecodeHandler(
            this.onMessage.bind(this)
        );
    }

    public start = function () {
        var adapter = this.adapter;

        adapter.onOpen = this.onOpen.bind(this);
        adapter.onData = this.onData.bind(this);
        adapter.onError = adapter.onEnd = this._onEnd.bind(this);

        adapter.connect();
    };

    public onData = function (data) {
        this.encodeDecode.decode(data);
    };

    public onOpen = function () {
        this.startTime = new Date();
        this.state.connected();

        this.guaranteedCommands.resend();
        this.onConnect();
    };

    public sendGuaranteedCommand = function (payloadType, params) {
        return this.guaranteedCommands.create(
            this.protocol.encode(payloadType, params)
        );
    };

    public sendCommand = function (payloadType, params) {
        return this.commands.create(
            this.protocol.encode(payloadType, params)
        );
    };

    public send = function (msg) {
        var data = this.encodeDecode.encode(msg);
        this.adapter.send(data);
    };

    public onMessage = function (data) {
        data = this.protocol.decode(data);
        var msg = data.msg;
        var payloadType = data.payloadType;
        var clientMsgId = data.clientMsgId;

        if (clientMsgId) {
            this.processMessage(msg, clientMsgId);
        } else {
            this.processPushEvent(msg, payloadType);
        }
    };

    public processMessage = function (msg, clientMsgId) {
        return this.guaranteedCommands.findAndResolve(msg, clientMsgId) || this.commands.findAndResolve(msg, clientMsgId);
    };

    public processPushEvent = function (msg, payloadType) {
        this.emit(payloadType, msg);
    };

    private _onEnd = function (e) {
        this.state.disconnected();
        this.commands.fail();
        this.onEnd(e);
    };

    public onConnect = function () {};

    public onEnd = function () {};
}
