'use strict';

var TextMessages = require('./tools/text_messages');
var createAdapter = require('./tools/adapter_websocket');
var TextEncodeDecode = require('./tools/text_encode_decode');
var Connect = require('../lib/connect');
var createCodec = require('connect-js-codec');

describe('WebSocket with text stream and json protocol', function () {
    var
        connect;

    beforeAll(function () {
        var
            adapter = createAdapter(),
            textEncodeDecode = new TextEncodeDecode(),
            textMessages = new TextMessages(),
            codec = createCodec(adapter, textEncodeDecode, textMessages);


        connect = new Connect({
            adapter: adapter,
            codec: codec
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
