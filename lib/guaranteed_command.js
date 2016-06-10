"use strict";
var GuaranteedCommand = (function () {
    function GuaranteedCommand(msg) {
        this.msg = msg;
        this.promise = $.Deferred();
    }
    GuaranteedCommand.prototype.done = function (msg) {
        this.promise.resolve(msg);
        this.destroy();
    };
    GuaranteedCommand.prototype.fail = function (msg) {
        this.promise.reject(msg);
        this.destroy();
    };
    GuaranteedCommand.prototype.destroy = function () {
        delete this.msg;
    };
    return GuaranteedCommand;
}());
exports.GuaranteedCommand = GuaranteedCommand;
//# sourceMappingURL=guaranteed_command.js.map