"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var index_1 = __importDefault(require("../dargon/index"));
var refreshRate = config_1.REFRESH_RATE * config_1.SECONDS;
var Generation = /** @class */ (function () {
    function Generation() {
        this.accountIds = new Set();
        this.expiration = this.calculateExpiration();
        this.generationId = undefined;
    }
    Generation.prototype.calculateExpiration = function () {
        var expirationPeriod = Math.floor(Math.random() * (refreshRate / 2));
        var msUntilExpiration = Math.random() < 0.5 ? refreshRate - expirationPeriod : refreshRate + expirationPeriod;
        return new Date(Date.now() + msUntilExpiration);
    };
    Generation.prototype.newDragon = function (_a) {
        var accountId = _a.accountId;
        if (new Date(Date.now()) > this.expiration) {
            throw new Error("This generation expired on " + this.expiration);
        }
        if (this.accountIds.has(accountId))
            throw new Error('You already have dragon from this generation');
        this.accountIds.add(accountId); //each account only can get one dragon on each generation
        return new index_1.default({ generationId: this.generationId });
    };
    return Generation;
}());
exports.default = Generation;
