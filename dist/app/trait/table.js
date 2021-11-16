"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var databasePool_1 = __importDefault(require("../../databasePool"));
var TraitTable = /** @class */ (function () {
    function TraitTable() {
    }
    TraitTable.getTraitId = function (_a) {
        var traitType = _a.traitType, traitValue = _a.traitValue;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('SELECT id FROM trait WHERE "traitType" = $1 AND "traitValue" = $2', [traitType, traitValue], function (error, response) {
                if (error)
                    reject(error);
                resolve({ traitId: response.rows[0].id });
            });
        });
    };
    return TraitTable;
}());
exports.default = TraitTable;
