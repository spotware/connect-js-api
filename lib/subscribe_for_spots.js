'use strict';

var ACCOUNT_ID = 62002;
var ACCOUNT_TOKEN = 'test002_access_token';

var subscribeForSpots = function (symblolName) {
    var name ='ProtoOASubscribeForSpotsReq';
    var payloadType = this.protoMessagesOpenApi.getPayloadTypeByName(name);
    return this.sendGuaranteedCommand(payloadType, {
        accountId: ACCOUNT_ID,
        accessToken: ACCOUNT_TOKEN,
        symblolName: symblolName
    });
};

module.exports = subscribeForSpots;
