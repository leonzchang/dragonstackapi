"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var databasePool_1 = __importDefault(require("../../databasePool"));
var table_1 = __importDefault(require("../trait/table"));
var DragonTraitTable = /** @class */ (function () {
    function DragonTraitTable() {
    }
    DragonTraitTable.storeDragonTrait = function (_a) {
        var dragonId = _a.dragonId, traitType = _a.traitType, traitValue = _a.traitValue;
        return new Promise(function (resolve, reject) {
            table_1.default.getTraitId({ traitType: traitType, traitValue: traitValue }).then(function (_a) {
                var traitId = _a.traitId;
                databasePool_1.default.query('INSERT INTO dragonTrait("traitId","dragonId") VALUES($1, $2)', [traitId, dragonId], function (error) {
                    if (error)
                        return reject(error);
                    resolve();
                });
            });
        });
    };
    return DragonTraitTable;
}());
exports.default = DragonTraitTable;
