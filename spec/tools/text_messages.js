'use strict';

var TextMessages = function () {};

TextMessages.prototype.encode = function (payloadType, params, clientMsgId) {
    var message = params;
    return this.wrap(payloadType, message, clientMsgId);
};

TextMessages.prototype.wrap = function (payloadType, message, clientMsgId) {
    return {
        payloadType: payloadType,
        payload: message,
        clientMsgId: clientMsgId
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
