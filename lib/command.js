'use strict';

var Command = function (msg) {
    this.msg = msg;
    this.promise = new Promise(function (resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }.bind(this));
};

Command.prototype.done = function (respond) {
    this.resolve(respond);
    this.destroy();
};

Command.prototype.fail = function () {
    this.reject();
    this.destroy();
};

Command.prototype.destroy = function () {
    delete this.msg;
    delete this.resolve;
    delete this.reject;
};

module.exports = Command;
