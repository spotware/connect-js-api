"use strict";
var Command = (function () {
    function Command(msg) {
        this.msg = msg;
        this.promise = $.Deferred();
    }
    Command.prototype.done = function (respond) {
        this.promise.resolve(respond);
        this.destroy();
    };
    Command.prototype.fail = function (respond) {
        this.promise.reject(respond);
        this.destroy();
    };
    Command.prototype.destroy = function () {
        delete this.msg;
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=command.js.map