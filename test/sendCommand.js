'use strict';

var ProtoMessages = require('connect-protobuf-messages');
var AdapterTLS = require('connect-js-adapter-tls');
var EncodeDecode = require('connect-js-encode-decode');
var Connect = require('../lib/connect');

describe('sendCommand', function () {
    var connect;
    var adapter;
    var protoMessages;
    var encodeDecode;
    var payloadType;
    var sendCommand;

    var makeAdapterLazy = function (respondDelay) {
        var send = adapter.send.bind(adapter);
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

        connect.onConnect = done;
        connect.start();
    });

    it('resolved by respond', function (done) {
        sendCommand().then(done);
    });

    it('reject by closing connection', function (done) {
        makeAdapterLazy({
            respondDelay: 1000
        });

        sendCommand().then(null, done);

        adapter.onEnd();
    });

    it('execute command with close connection', function (done) {
        adapter.onEnd();

        sendCommand().then(null, done);
    });

});
