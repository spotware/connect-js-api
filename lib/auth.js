'use strict';

var CLIENT_ID = '7_5az7pj935owsss8kgokcco84wc8osk0g0gksow0ow4s4ocwwgc';
var CLIENT_SECRET = '49p1ynqfy7c4sw84gwoogwwsk8cocg8ow8gc8o80c0ws448cs4';

var auth = function () {
    var name = 'ProtoOAAuthReq';
    var payloadType = this.protoMessagesOpenApi.getPayloadTypeByName(name);
    return this.sendGuaranteedCommand(payloadType, {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET
    });
};

module.exports = auth;
