'use strict';

var startPing = function (interval) {
    var name = 'ProtoPingReq';
    var payloadType = this.protoMessagesCommon.getPayloadTypeByName(name);
    this.pingInterval = setInterval(function () {
        this.sendGuaranteedCommand(payloadType, {
            timestamp: Date.now()
        }).then(function () {
            console.log('PING_RES');
        });
    }.bind(this), interval);
};

module.exports = startPing;
