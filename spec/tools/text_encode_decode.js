'use strict';

var TextEncodeDecode = function () {
    this.decodeHandler = undefined;
};

TextEncodeDecode.prototype.registerDecodeHandler = function (handler) {
    this.decodeHandler = handler;
};

TextEncodeDecode.prototype.decode = function (data) {
    this.decodeHandler(data);
};

TextEncodeDecode.prototype.encode = function (data) {
    return JSON.stringify(data);
};

module.exports = TextEncodeDecode;
