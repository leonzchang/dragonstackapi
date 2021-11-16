"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var databasePool_1 = __importDefault(require("../../databasePool"));
var table_1 = __importDefault(require("../dragonTrait/table"));
var DragonTable = /** @class */ (function () {
    function DragonTable() {
    }
    DragonTable.storeDragon = function (dragon) {
        var birthdate = dragon.birthdate, nickname = dragon.nickname, generationId = dragon.generationId, isPublic = dragon.isPublic, saleValue = dragon.saleValue, sireValue = dragon.sireValue;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('INSERT INTO dragon(birthdate, nickname, "generationId", "isPublic", "saleValue", "sireValue") VALUES($1, $2, $3, $4, $5, $6) RETURNING id', [birthdate, nickname, generationId, isPublic, saleValue, sireValue], function (error, response) {
                if (error)
                    return reject(error);
                var dragonId = response.rows[0].id;
                Promise.all(dragon.traits.map(function (_a) {
                    var traitType = _a.traitType, traitValue = _a.traitValue;
                    return table_1.default.storeDragonTrait({ dragonId: dragonId, traitType: traitType, traitValue: traitValue });
                }))
                    .then(function () { return resolve({ dragonId: dragonId }); })
                    .catch(function (error) { return reject(error); });
            });
        });
    };
    DragonTable.getDragon = function (_a) {
        var dragonId = _a.dragonId;
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('SELECT birthdate, nickname, "generationId", "isPublic", "saleValue", "sireValue" FROM dragon WHERE dragon.id = $1', [dragonId], function (error, response) {
                if (error)
                    reject(error);
                if (response.rows.length === 0)
                    reject(new Error('no dragon'));
                resolve(response.rows[0]);
            });
        });
    };
    DragonTable.updateDragon = function (_a) {
        var dragonId = _a.dragonId, nickname = _a.nickname, isPublic = _a.isPublic, saleValue = _a.saleValue, sireValue = _a.sireValue;
        var settingMap = { nickname: nickname, isPublic: isPublic, saleValue: saleValue, sireValue: sireValue };
        //array of promise   //convert object to array
        var validQueries = Object.entries(settingMap).filter(function (_a) {
            var settingKey = _a[0], settingValue = _a[1];
            if (settingValue !== undefined) {
                return new Promise(function (resolve, reject) {
                    databasePool_1.default.query("UPDATE dragon SET \"" + settingKey + "\" = $1 WHERE id = $2", [settingValue, dragonId], function (error) {
                        if (error)
                            reject(error);
                        resolve();
                    });
                });
            }
        });
        return Promise.all(validQueries);
    };
    return DragonTable;
}());
exports.default = DragonTable;
