"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var traits_json_1 = __importDefault(require("../data/traits.json"));
var databasePool_1 = __importDefault(require("../databasePool"));
traits_json_1.default.forEach(function (TRAIT) {
    var traitType = TRAIT.type;
    var traitValues = TRAIT.values;
    traitValues.forEach(function (traitValue) {
        databasePool_1.default.query('INSERT INTO trait("traitType", "traitValue") VALUES($1, $2) RETURNING id', [traitType, traitValue], function (error, response) {
            if (error)
                console.error(error);
            var traitId = response.rows[0].id;
            console.log("Inserted trait - id: " + traitId);
        });
    });
});
