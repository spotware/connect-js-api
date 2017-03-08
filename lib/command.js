'use strict';

var Command = function (params) {
    this.clientMsgId = params.clientMsgId;
    this.promise = new Promise(function (resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }.bind(this));
};

Command.prototype.done = function (payload) {
    this.resolve(payload);
    this.destroy();
};

Command.prototype.fail = function (payload) {
    this.reject(payload);
    this.destroy();
};

Command.prototype.destroy = function () {
    delete this.clientMsgId;
    delete this.resolve;
    delete this.reject;
};

module.exports = Command;
