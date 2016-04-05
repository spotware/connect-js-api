'use strict';

var fs = require('fs');
var ProtoMessages = require('connect-protobuf-messages');
var EncodeDecode = require('../lib/encode_decode');
var Buffer = require('buffer').Buffer;

describe('EncodeDecode', function () {
    var buffer;
    var encodeDecode;
    var protoMessages;
    var checkBuffer;

    beforeAll(function () {
        protoMessages = new ProtoMessages([
            {
                file: 'node_modules/connect-protobuf-messages/src/main/protobuf/CommonMessages.proto',
                protoPayloadType: 'ProtoPayloadType'
            }
        ]);
        protoMessages.load();
        protoMessages.build();

        checkBuffer = function (buffer) {
            var msg = protoMessages.decode(buffer);
            expect(msg.clientMsgId).toBeDefined();
        };
    });

    beforeEach(function () {
        buffer = fs.readFileSync('./test/data/ProtoPingRes');
        encodeDecode = new EncodeDecode();
    });

    it('full buffer', function () {
        checkBuffer(buffer);
    });

    it('two messages in one buffer', function (done) {
        var count = 2;

        encodeDecode.registerDecodeHandler(function (buffer) {
            checkBuffer(buffer);
            count -= 1;
            if (count === 0) {
                done();
            }
        });

        encodeDecode.decode(Buffer.concat([buffer, buffer], 2 * buffer.length));
    });

    it('two messages and half in one frame and rest into second frame', function (done) {
        var count = 3;

        encodeDecode.registerDecodeHandler(function (buffer) {
            checkBuffer(buffer);
            count -= 1;
            if (count === 0) {
                done();
            }
        });

        var firstHalfBuffer = buffer.slice(0, 5);
        var lastHalfBuffer = buffer.slice(5);

        encodeDecode.decode(Buffer.concat([buffer, buffer, firstHalfBuffer], 2 * buffer.length + firstHalfBuffer.length));
        encodeDecode.decode(lastHalfBuffer);
    });

    it('first part 1 byte', function (done) {
        encodeDecode.registerDecodeHandler(function (buffer) {
            checkBuffer(buffer);
            done();
        });

        encodeDecode.decode(buffer.slice(0, 1));
        encodeDecode.decode(buffer.slice(1));
    });

    it('first part 1 byte, second part 4 byte', function (done) {
        encodeDecode.registerDecodeHandler(function (buffer) {
            checkBuffer(buffer);
            done();
        });

        encodeDecode.decode(buffer.slice(0, 1));
        encodeDecode.decode(buffer.slice(1, 5));
        encodeDecode.decode(buffer.slice(5));
    });

    it('cut to array of 1 byte', function (done) {
        encodeDecode.registerDecodeHandler(function (buffer) {
            checkBuffer(buffer);
            done();
        });

        for (var i = 1; i <= buffer.length; i += 1) {
            encodeDecode.decode(buffer.slice(i - 1, i));
        }
    });

    it('first part 6 byte, second part 1 byte', function (done) {
        encodeDecode.registerDecodeHandler(function (buffer) {
            checkBuffer(buffer);
            done();
        });

        encodeDecode.decode(buffer.slice(0, 6));
        encodeDecode.decode(buffer.slice(6, 7));
        encodeDecode.decode(buffer.slice(7));
    });

    it('last part 1 byte', function (done) {
        encodeDecode.registerDecodeHandler(function (buffer) {
            checkBuffer(buffer);
            done();
        });

        var separator = buffer.length - 1;

        encodeDecode.decode(buffer.slice(0, separator));
        encodeDecode.decode(buffer.slice(separator));
    });
});
