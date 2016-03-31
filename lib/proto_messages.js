'use strict';

var protobuf = require('protobufjs');
var hat = require('hat');

var ProtoMessages = function (params) {
    this.params = params;
    this.builder = undefined;
    this.payloadTypes = {};
    this.names = {};
};

ProtoMessages.prototype.encode = function (payloadType, params) {
    var Message = this.getMessageByPayloadType(payloadType);
    var message = new Message(params);
    return this.wrap(payloadType, message);
};

ProtoMessages.prototype.wrap = function (payloadType, message) {
    var ProtoMessage = this.getMessageByName('ProtoMessage');
    return new ProtoMessage({
        payloadType: payloadType,
        payload: message.toBuffer(),
        clientMsgId: hat()
    });
};

ProtoMessages.prototype.decode = function (buffer) {
    var ProtoMessage = this.getMessageByName('ProtoMessage');
    var protoMessage = ProtoMessage.decode(buffer);
    var payloadType = protoMessage.payloadType;

    return {
        msg: this.getMessageByPayloadType(payloadType).decode(protoMessage.payload),
        payloadType: payloadType,
        clientMsgId: protoMessage.clientMsgId
    };
};

ProtoMessages.prototype.load = function (config) {
    this.builders = this.params.map(function (param) {
        return protobuf.loadProtoFile(param.file);
    });
};

ProtoMessages.prototype.build = function () {
    this.builders.forEach(function (builder) {
        builder.build(this.protoPayloadType);

        var messages = builder.ns.children.filter(function (reflect) {
            return (reflect.className === 'Message') && (typeof this.findPayloadType(reflect) === 'number');
        }, this);

        messages.forEach(function (message) {
            var payloadType = this.findPayloadType(message);
            var name = message.name;

            var messageBuilded = builder.build(name);

            this.names[name] = {
                messageBuilded: messageBuilded,
                payloadType: payloadType
            };
            this.payloadTypes[payloadType] = {
                messageBuilded: messageBuilded,
                name: name
            };
        }, this);
    }, this);

    this.buildWrapper();
};

ProtoMessages.prototype.buildWrapper = function () {
    var name = 'ProtoMessage';
    var messageBuilded = this.builders[0].build(name);
    this.names[name] = {
        messageBuilded: messageBuilded,
        payloadType: undefined
    };
};

ProtoMessages.prototype.findPayloadType = function (message) {
    var field = message.children.find(function (field) {
        return field.name === 'payloadType';
    });

    if (field) {
        return field.defaultValue;
    }
};

ProtoMessages.prototype.getMessageByPayloadType = function (payloadType) {
    return this.payloadTypes[payloadType].messageBuilded;
};

ProtoMessages.prototype.getMessageByName = function (name) {
    return this.names[name].messageBuilded;
};

ProtoMessages.prototype.getPayloadTypeByName = function (name) {
    return this.names[name].payloadType;
};

module.exports = ProtoMessages;
