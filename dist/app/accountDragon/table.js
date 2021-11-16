"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var databasePool_1 = __importDefault(require("../../databasePool"));
var AccountDragonTable = /** @class */ (function () {
    function AccountDragonTable() {
    }
    AccountDragonTable.storeAccountDragon = function (_a) {
        var accountId = _a.accountId, dragonId = _a.dragonId;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('INSERT INTO accountDragon("accountId","dragonId") VALUES($1,$2)', [accountId, dragonId], function (error) {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    };
    AccountDragonTable.getAccountDragon = function (_a) {
        var accountId = _a.accountId;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('SELECT "dragonId" FROM accountDragon where "accountId" = $1', [accountId], function (error, response) {
                if (error)
                    return reject(error);
                resolve({ accountDragons: response.rows });
            });
        });
    };
    AccountDragonTable.getDragonAccount = function (_a) {
        var dragonId = _a.dragonId;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('SELECT "accountId" FROM accountDragon WHERE "dragonId" = $1', [dragonId], function (error, response) {
                if (error)
                    return reject(error);
                resolve({ accountId: response.rows[0].accountId });
            });
        });
    };
    AccountDragonTable.updateDragonAccount = function (_a) {
        var dragonId = _a.dragonId, accountId = _a.accountId;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('UPDATE accountDragon SET "accountId" = $1 WHERE "dragonId" = $2', [accountId, dragonId], function (error) {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    };
    return AccountDragonTable;
}());
exports.default = AccountDragonTable;
