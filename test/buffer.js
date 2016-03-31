'use strict';

var Buffer = require('buffer').Buffer;

describe('Buffer should work as exected', function () {

    it('should have method: concat', function () {
        expect(Buffer.concat).toBeDefined();
    });

    it('should have method: slice', function () {
        expect(Buffer.prototype.slice).toBeDefined();
    });

    describe('(**) -> (*)(*) -> (**)', function () {
        var buffer;
        var parts = [];

        it('create buffer (**)', function () {
            buffer = new Buffer(2);
            buffer.fill(7, 0, 1);
            buffer.fill(3, 1, 2);
            expect(buffer[0]).toBe(7);
            expect(buffer[1]).toBe(3);
        });

        it('slice buffer (**) into two buffers (*)(*)', function () {
            parts[0] = buffer.slice(0, 1);
            parts[1] = buffer.slice(1);
            expect(parts[0] instanceof Buffer).toBeTruthy();
            expect(parts[1] instanceof Buffer).toBeTruthy();
        });

        it('concat buffers (*)(*) into (*)', function () {
            var b = Buffer.concat(parts, parts[0].length + parts[1].length);
            expect(b instanceof Buffer).toBeTruthy();
            expect(b[0]).toBe(buffer[0]);
            expect(b[1]).toBe(buffer[1]);
        });
    });
});
