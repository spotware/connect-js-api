'use strict';

var Command = function (params) {
    this.clientMsgId = params.clientMsgId;
    this.promise = new Promise(function (resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }.bind(this));
};

Command.prototype.done = function (msg) {
    this.resolve(msg);
    this.destroy();
};

Command.prototype.fail = function (msg) {
    this.reject(msg);
    this.destroy();
};

Command.prototype.destroy = function () {
    delete this.clientMsgId;
    delete this.resolve;
    delete this.reject;
};

module.exports = Command;
