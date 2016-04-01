'use strict';

var fs = require('fs');
var ProtoMessages = require('../lib/proto_messages');
var Stream = require('../lib/stream');
var Buffer = require('buffer').Buffer;

describe('Stream', function () {
    var buffer;
    var stream;
    var protoMessages;
    var checkBuffer;

    beforeAll(function () {
        protoMessages = new ProtoMessages([
            {
                file: 'test/proto/CommonMessages.proto',
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
        stream = new Stream();
    });

    it('full buffer', function () {
        checkBuffer(buffer);
    });

    it('two messages in one buffer', function (done) {
        var count = 2;

        stream.onDecode = function (buffer) {
            checkBuffer(buffer);
            count -= 1;
            if (count === 0) {
                done();
            }
        };

        stream.decode(Buffer.concat([buffer, buffer], 2 * buffer.length));
    });

    it('two messages and half in one frame and rest into second frame', function (done) {
        var count = 3;

        stream.onDecode = function (buffer) {
            checkBuffer(buffer);
            count -= 1;
            if (count === 0) {
                done();
            }
        };

        var firstHalfBuffer = buffer.slice(0, 5);
        var lastHalfBuffer = buffer.slice(5);

        stream.decode(Buffer.concat([buffer, buffer, firstHalfBuffer], 2 * buffer.length + firstHalfBuffer.length));
        stream.decode(lastHalfBuffer);
    });

    it('first part 1 byte', function (done) {
        stream.onDecode = function (buffer) {
            checkBuffer(buffer);
            done();
        };

        stream.decode(buffer.slice(0, 1));
        stream.decode(buffer.slice(1));
    });

    it('first part 1 byte, second part 4 byte', function (done) {
        stream.onDecode = function (buffer) {
            checkBuffer(buffer);
            done();
        };

        stream.decode(buffer.slice(0, 1));
        stream.decode(buffer.slice(1, 5));
        stream.decode(buffer.slice(5));
    });

    it('cut to array of 1 byte', function (done) {
        stream.onDecode = function (buffer) {
            checkBuffer(buffer);
            done();
        };

        for (var i = 1; i <= buffer.length; i += 1) {
            stream.decode(buffer.slice(i - 1, i));
        }
    });

    it('first part 6 byte, second part 1 byte', function (done) {
        stream.onDecode = function (buffer) {
            checkBuffer(buffer);
            done();
        };

        stream.decode(buffer.slice(0, 6));
        stream.decode(buffer.slice(6, 7));
        stream.decode(buffer.slice(7));
    });

    it('last part 1 byte', function (done) {
        stream.onDecode = function (buffer) {
            checkBuffer(buffer);
            done();
        };

        var separator = buffer.length - 1;

        stream.decode(buffer.slice(0, separator));
        stream.decode(buffer.slice(separator));
    });
});
