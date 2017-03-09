'use strict';

var GuaranteedCommand = function (params) {
    this.payload = params.payload;
    this.clientMsgId = params.clientMsgId;
    this.promise = new Promise(function (resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }.bind(this));
};

GuaranteedCommand.prototype.done = function (payload) {
    this.resolve(payload);
    this.destroy();
};

GuaranteedCommand.prototype.fail = function (payload) {
    this.reject(payload);
    this.destroy();
};

GuaranteedCommand.prototype.destroy = function () {
    delete this.payload;
    delete this.clientMsgId;
    delete this.resolve;
    delete this.reject;
};

module.exports = GuaranteedCommand;
