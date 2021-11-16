"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var databasePool_1 = __importDefault(require("../../databasePool"));
var GenerationTable = /** @class */ (function () {
    function GenerationTable() {
    }
    GenerationTable.storeGeneration = function (generation) {
        return new Promise(function (resolve, reject) {
            databasePool_1.default.query('INSERT INTO generation(expiration) VALUES($1) RETURNING id ', [generation.expiration], function (error, response) {
                if (error)
                    return reject(error);
                var generationId = response.rows[0].id;
                resolve({ generationId: generationId });
            });
        });
    };
    return GenerationTable;
}());
exports.default = GenerationTable;
