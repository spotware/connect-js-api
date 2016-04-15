'use strict';

var State = function () {
    this.disconnected();
};

State.prototype.disconnected = function () {
    this.value = false;
};

State.prototype.connected = function () {
    this.value = true;
};

State.prototype.isConnected = function () {
    return this.value;
};

module.exports = State;
