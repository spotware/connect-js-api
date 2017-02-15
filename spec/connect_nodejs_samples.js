'use strict';

var ProtoMessages = require('connect-protobuf-messages');
var AdapterTLS = require('connect-js-adapter-tls');
var EncodeDecode = require('connect-js-encode-decode');
var Connect = require('../lib/connect');
var state = require('../lib/state');
var ping = require('./tools/ping');
var auth = require('./tools/auth');
var subscribeForSpots = require('./tools/subscribe_for_spots');

describe('connect-nodejs-sample', function () {
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

        ping = ping.bind(connect);
        auth = auth.bind(connect);
        subscribeForSpots = subscribeForSpots.bind(connect);
    });

    it('ping & auth & stops', function (done) {
        protoMessages.load();
        protoMessages.build();

        connect.onConnect = function () {
            ping(1000);
            auth({
                clientId: '7_5az7pj935owsss8kgokcco84wc8osk0g0gksow0ow4s4ocwwgc',
                clientSecret: '49p1ynqfy7c4sw84gwoogwwsk8cocg8ow8gc8o80c0ws448cs4'
            }).then(function (respond) {
                subscribeForSpots({
                    accountId: 62002,
                    accessToken: 'test002_access_token',
                    symblolName: 'EURUSD'
                }).then(function (respond) {
                    expect(respond.subscriptionId).toBeDefined();
                    done();
                });
            });
        };

        connect.start();
    });
});
