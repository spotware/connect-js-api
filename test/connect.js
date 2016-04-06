'use strict';

var tls = require('tls');
var ProtoMessages = require('connect-protobuf-messages');
var AdapterTLS = require('connect-js-adapter-tls');
var EncodeDecode = require('connect-js-encode-decode');
var Connect = require('../lib/connect');
var state = require('../lib/state');
var ping = require('./tools/ping');
var auth = require('./tools/auth');
var subscribeForSpots = require('./tools/subscribe_for_spots');

describe('Connect', function () {
    var connect;
    var protoMessages;

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

        var adapter = new AdapterTLS({
            host: 'sandbox-tradeapi.spotware.com',
            port: 5032
        });

        var encodeDecode = new EncodeDecode();

        connect = new Connect({
            adapter: adapter,
            encodeDecode: encodeDecode,
            protocol: protoMessages
        });
    });

    it('loadProto', function () {
        protoMessages.load();
        protoMessages.build();

        var ProtoMessage = protoMessages.getMessageByName('ProtoMessage');
        var protoMessage = new ProtoMessage({
            payloadType: 1
        });
        expect(protoMessage.payloadType).toBe(1);
    });

    it('onConnect', function (done) {
        connect.onConnect = done;
        connect.start();
    });

    it('ping', function (done) {
        var name = 'ProtoPingReq';
        var ProtoPingReq = protoMessages.getMessageByName(name);
        var payloadType = protoMessages.getPayloadTypeByName(name);
        var msg = new ProtoPingReq({
            timestamp: Date.now()
        });
        connect.sendGuaranteedCommand(payloadType, msg).then(function (respond) {
            expect(respond.timestamp).toBeDefined();
            done();
        });
    });

    it('auth', function (done) {
        auth.call(connect, {
            clientId: '7_5az7pj935owsss8kgokcco84wc8osk0g0gksow0ow4s4ocwwgc',
            clientSecret: '49p1ynqfy7c4sw84gwoogwwsk8cocg8ow8gc8o80c0ws448cs4'
        }).then(done);
    });

    it('subscribeForSpots', function (done) {
        subscribeForSpots.call(connect, {
            accountId: 62002,
            accessToken: 'test002_access_token',
            symblolName: 'EURUSD'
        }).then(done);
    });

    it('onError', function () {
        var adapter = connect.adapter;
        adapter._onError = function () {
            expect(connect.state).toBe(state.disconnected);
        };
        adapter.send(new Buffer(0));
    });

    it('adapter.socket instanceof tls.TLSSocket', function () {
        expect(connect.adapter.socket instanceof tls.TLSSocket).toBeTruthy();
    });

});
