'use strict';

var subscribeForSpots = function (params) {
    var name ='ProtoOASubscribeForSpotsReq';
    var payloadType = this.protocol.getPayloadTypeByName(name);
    return this.sendGuaranteedCommand(payloadType, {
        accountId: params.accountId,
        accessToken: params.accessToken,
        symblolName: params.symblolName
    });
};

module.exports = subscribeForSpots;
