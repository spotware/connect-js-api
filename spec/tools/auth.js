'use strict';

var auth = function (params) {
    var payloadType = this.protocol.getPayloadTypeByName('ProtoOAAuthReq');
    return this.sendGuaranteedCommand(payloadType, {
        clientId: params.clientId,
        clientSecret: params.clientSecret
    });
};

module.exports = auth;
