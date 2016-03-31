'use strict';

var Command = function (params) {
    this.msg = params.msg;
    this.promise = new Promise(function (resolve) {
        this.resolve = resolve;
    }.bind(this));
};

Command.prototype.done = function (msg) {
    this.resolve(msg);
    this.destroy();
};

Command.prototype.destroy = function () {
    delete this.msg;
    delete this.resolve;
};

module.exports = Command;
