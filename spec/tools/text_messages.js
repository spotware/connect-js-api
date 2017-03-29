'use strict';

var TextMessages = function () {};

TextMessages.prototype.encode = function (payloadType, payload, clientMsgId) {
    return {
        payloadType: payloadType,
        payload: payload,
        clientMsgId: clientMsgId
    };
};

TextMessages.prototype.decode = function (data) {
    var protoMessage = JSON.parse(data);

    return {
        payloadType: protoMessage.payloadType,
        payload: protoMessage.payload,
        clientMsgId: protoMessage.clientMsgId
    };
};

TextMessages.prototype.load = function () {};

TextMessages.prototype.build = function () {};

module.exports = TextMessages;
