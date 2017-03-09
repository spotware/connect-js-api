'use strict';

var TextMessages = require('./tools/text_messages');
var AdapterWebSocket = require('./tools/adapter_websocket');
var TextEncodeDecode = require('./tools/text_encode_decode');
var Connect = require('../lib/connect');

describe('WebSocket with text stream and json protocol', function () {
    var
        connect;

    beforeAll(function (done) {
        var
            adapter = new AdapterWebSocket(),
            textEncodeDecode = new TextEncodeDecode(),
            textMessages = new TextMessages();

        connect = new Connect({
            adapter: adapter,
            encodeDecode: textEncodeDecode,
            protocol: textMessages
        });

        adapter.onOpen(function () {
            done();
        });

        adapter.connect('wss://x3.p.ctrader.com:5030');
    });

    it('ping', function (done) {
        connect.sendGuaranteedCommand(52, {
            timestamp: Date.now()
        }).then(function (respond) {
            expect(respond.timestamp).toBeDefined();
            done();
        });
    });
});
