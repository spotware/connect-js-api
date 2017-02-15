'use strict';

var createOrder = function (params) {
    var payloadType = this.protocol.getPayloadTypeByName('ProtoOACreateOrderReq');
    return this.sendGuaranteedCommand(payloadType, {
        accountId: params.accountId,
        accessToken: params.accessToken,
        symbolName: params.symbolName,
        orderType: params.orderType,
        tradeSide: params.tradeSide,
        volume: params.volume,
        clientOrderId: params.clientOrderId,
        comment: params.comment
    });
};

module.exports = createOrder;
