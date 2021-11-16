"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var databasePool_1 = __importDefault(require("../../databasePool"));
var config_1 = require("../config");
var AccountTable = /** @class */ (function () {
    function AccountTable() {
    }
    AccountTable.storeAccount = function (_a) {
        var usernameHash = _a.usernameHash, passwordHash = _a.passwordHash;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('INSERT INTO account("usernameHash", "passwordHash", balance) VALUES($1, $2, $3)', [usernameHash, passwordHash, config_1.STARTING_BALANCE], function (error) {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    };
    AccountTable.getAccount = function (_a) {
        var usernameHash = _a.usernameHash;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('SELECT id, "passwordHash","sessionId",balance FROM account WHERE "usernameHash" = $1', [usernameHash], function (error, response) {
                if (error)
                    return reject(error);
                resolve({ account: response.rows[0] });
            });
        });
    };
    AccountTable.updateSessionId = function (_a) {
        var sessionId = _a.sessionId, usernameHash = _a.usernameHash;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('UPDATE account SET "sessionId" = $1 WHERE "usernameHash" = $2', [sessionId, usernameHash], function (error) {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    };
    AccountTable.updateBalance = function (_a) {
        var accountId = _a.accountId, value = _a.value;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('UPDATE account SET balance = balance + $1 WHERE id = $2', [value, accountId], function (error) {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    };
    return AccountTable;
}());
exports.default = AccountTable;
