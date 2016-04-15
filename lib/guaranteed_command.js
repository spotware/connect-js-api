'use strict';

var GuaranteedCommand = function (msg) {
    this.msg = msg;
    this.promise = new Promise(function (resolve) {
        this.resolve = resolve;
    }.bind(this));
};

GuaranteedCommand.prototype.done = function (msg) {
    this.resolve(msg);
    this.destroy();
};

GuaranteedCommand.prototype.destroy = function () {
    delete this.msg;
    delete this.resolve;
};

module.exports = GuaranteedCommand;
