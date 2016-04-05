'use strict';

var TextEncodeDecode = function () {};

TextEncodeDecode.prototype.decode = function (data) {
    this.onDecode(data);
};

TextEncodeDecode.prototype.encode = function (data) {
    return JSON.stringify(data);
};

module.exports = TextEncodeDecode;
