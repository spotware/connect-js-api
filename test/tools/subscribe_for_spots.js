'use strict';

var subscribeForSpots = function (params) {
    var payloadType = this.protocol.getPayloadTypeByName('ProtoOASubscribeForSpotsReq');
    return this.sendGuaranteedCommand(payloadType, {
        accountId: params.accountId,
        accessToken: params.accessToken,
        symblolName: params.symblolName
    });
};

module.exports = subscribeForSpots;
