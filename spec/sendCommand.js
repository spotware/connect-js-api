'use strict';

var ProtoMessages = require('connect-protobuf-messages');
var AdapterTLS = require('connect-js-adapter-tls');
var EncodeDecode = require('connect-js-encode-decode');
var Connect = require('../lib/connect');

describe('sendCommand', function () {
    var
        connect,
        adapter,
        protoMessages,
        encodeDecode,
        payloadType,
        sendCommand,
        serverWillDropConnectionIn = 60000,
        makeAdapterLazy = function (adapter, respondDelay) {
            var
                send = adapter.send.bind(adapter);

            adapter.send = function (data) {
                setTimeout(function () {
                    send(data);
                }, respondDelay);
            };
        };

    beforeAll(function () {
        protoMessages = new ProtoMessages([
            {
                file: 'node_modules/connect-protobuf-messages/src/main/protobuf/CommonMessages.proto',
                protoPayloadType: 'ProtoPayloadType'
            },
            {
                file: 'node_modules/connect-protobuf-messages/src/main/protobuf/OpenApiMessages.proto',
                protoPayloadType: 'ProtoOAPayloadType'
            }
        ]);

        protoMessages.load();
        protoMessages.build();

        payloadType = protoMessages.getPayloadTypeByName('ProtoPingReq');

        encodeDecode = new EncodeDecode();
    });

    beforeEach(function (done) {
        adapter = new AdapterTLS({
            host: 'sandbox-tradeapi.spotware.com',
            port: 5032
        });

        connect = new Connect({
            adapter: adapter,
            encodeDecode: encodeDecode,
            protocol: protoMessages
        });

        sendCommand = function () {
            return connect.sendCommand(payloadType, {
                timestamp: Date.now()
            });
        };

        adapter.onOpen(done);
        adapter.connect();
    });

    it('resolved by respond', function (done) {
        sendCommand().then(done);
    });

    xit('reject by closing connection', function () {});

    xit('execute command with close connection', function (done) {
        setTimeout(function () {
            sendCommand().then(null, done);
        }, serverWillDropConnectionIn);
    }, serverWillDropConnectionIn + 1000);

});
