'use strict';

var OneMessagePerFrameEncodeDecode = function (params) {
    this.decodeHandler = undefined;
};

OneMessagePerFrameEncodeDecode.prototype.registerDecodeHandler = function (handler) {
    this.decodeHandler = handler;
};

OneMessagePerFrameEncodeDecode.prototype.decode = function (buffer) {
    this.decodeHandler(buffer);
};

OneMessagePerFrameEncodeDecode.prototype.encode = function (data) {
    return data.toBuffer();
};

module.exports = OneMessagePerFrameEncodeDecode;
