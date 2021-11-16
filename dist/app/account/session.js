"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var helper_1 = __importDefault(require("./helper"));
var SEPARATOR = '|';
var Session = /** @class */ (function () {
    function Session(_a) {
        var username = _a.username;
        this.username = username;
        this.id = uuid_1.v4();
    }
    Session.prototype.toString = function () {
        var _a = this, username = _a.username, id = _a.id;
        return Session.sessionString({ username: username, id: id });
    };
    Session.parse = function (sessionString) {
        var sessionData = sessionString.split(SEPARATOR);
        return {
            username: sessionData[0],
            id: sessionData[1],
            sessionHash: sessionData[2],
        };
    };
    Session.verify = function (sessionString) {
        var _a = Session.parse(sessionString), username = _a.username, id = _a.id, sessionHash = _a.sessionHash;
        var accountData = Session.accountData({ username: username, id: id });
        return helper_1.default(accountData) === sessionHash;
    };
    Session.accountData = function (_a) {
        var username = _a.username, id = _a.id;
        return "" + username + SEPARATOR + id;
    };
    Session.sessionString = function (_a) {
        var username = _a.username, id = _a.id;
        var accountData = Session.accountData({ username: username, id: id });
        return "" + accountData + SEPARATOR + helper_1.default(accountData);
    };
    return Session;
}());
exports.default = Session;
