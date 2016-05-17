"use strict";
var State = (function () {
    function State() {
        this.disconnected();
    }
    State.prototype.disconnected = function () {
        this.value = false;
    };
    State.prototype.connected = function () {
        this.value = true;
    };
    State.prototype.isConnected = function () {
        return this.value;
    };
    return State;
}());
exports.State = State;
//# sourceMappingURL=state.js.map