'use strict';

var hat = require('hat');

var TextMessages = function () {};

TextMessages.prototype.encode = function (payloadType, params) {
    var message = params;
    return this.wrap(payloadType, message);
};

TextMessages.prototype.wrap = function (payloadType, message) {
    return {
        payloadType: payloadType,
        payload: message,
        clientMsgId: hat()
    };
};

TextMessages.prototype.decode = function (data) {
    var protoMessage = JSON.parse(data);

    return {
        msg: protoMessage.payload,
        payloadType: protoMessage.payloadType,
        clientMsgId: protoMessage.clientMsgId
    };
};

TextMessages.prototype.load = function () {};

TextMessages.prototype.build = function () {};

module.exports = TextMessages;
