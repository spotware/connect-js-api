'use strict';

var GuaranteedCommand = function (params) {
    this.msg = params.msg;
    this.clientMsgId = params.clientMsgId;
    this.promise = new Promise(function (resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }.bind(this));
};

GuaranteedCommand.prototype.done = function (msg) {
    this.resolve(msg);
    this.destroy();
};

GuaranteedCommand.prototype.fail = function (msg) {
    this.reject(msg);
    this.destroy();
};

GuaranteedCommand.prototype.destroy = function () {
    delete this.msg;
    delete this.clientMsgId;
    delete this.resolve;
    delete this.reject;
};

module.exports = GuaranteedCommand;
