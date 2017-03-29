'use strict';

var ProtoMessages = require('connect-protobuf-messages');
var AdapterTLS = require('connect-js-adapter-tls');
var EncodeDecode = require('connect-js-encode-decode');
var createCodec = require('connect-js-codec');
var Connect = require('../lib/connect');
var state = require('../lib/state');
var ping = require('./tools/ping');
var subscribeForSpots = require('./tools/subscribe_for_spots');
var createOrder = require('./tools/create_order');

describe('Connect', function () {
    var adapter;
    var connect;
    var protoMessages;
    var codec;

    beforeAll(function () {
        adapter = new AdapterTLS({
            host: 'sandbox-tradeapi.spotware.com',
            port: 5032
        });

        var encodeDecode = new EncodeDecode();

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

        codec = createCodec(adapter, encodeDecode, protoMessages);

        connect = new Connect({
            adapter: adapter,
            codec: codec
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
        adapter.onOpen(done);
        adapter.connect();
    });

    it('ping', function (done) {
        var
            payloadType = 52,
            payload = {
                timestamp: Date.now()
            };

        connect.sendGuaranteedCommand(payloadType, payload).then(function (payload) {
            expect(payload.timestamp).toBeDefined();
            done();
        });
    });

    it('auth', function (done) {
        var
            payloadType = protoMessages.getPayloadTypeByName('ProtoOAAuthReq'),
            payload = {
                clientId: '7_5az7pj935owsss8kgokcco84wc8osk0g0gksow0ow4s4ocwwgc',
                clientSecret: '49p1ynqfy7c4sw84gwoogwwsk8cocg8ow8gc8o80c0ws448cs4'
            };

        connect.sendGuaranteedCommand(payloadType, payload).then(done);
    });

    xit('subscribeForSpots', function (done) {
        subscribeForSpots.call(connect, {
            accountId: 62002,
            accessToken: 'test002_access_token',
            symblolName: 'EURUSD'
        }).then(function (d) {
            console.log('subFSpot: ');console.dir(d);
        });
    });

    it('onError', function () {
        var adapter = connect.adapter;
        adapter._onError = function () {
            expect(connect.state).toBe(state.disconnected);
        };
        adapter.send(new Buffer(0));
    });

    xit('createOrder', function (done) {
        createOrder.call(connect, {
            accountId: 62002,
            accessToken: 'test002_access_token',
            symbolName: 'EURUSD',
            orderType: 1,
            tradeSide: 1,
            volume: 5699999.999999999,
            clientOrderId: '1691',
            comment: '1691'
        }).then(function (respond) {
            done();
        });
    });

});
