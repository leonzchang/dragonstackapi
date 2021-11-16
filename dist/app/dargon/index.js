"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var traits_json_1 = __importDefault(require("../../data/traits.json"));
var DEFAULT_PROPERTIES = {
    dragonId: undefined,
    nickname: 'unnamed',
    generationId: undefined,
    isPublic: false,
    saleValue: 0,
    sireValue: 0,
    get birthdate() {
        return new Date();
    },
    get randomTraits() {
        var traits = [];
        traits_json_1.default.forEach(function (TRAIT) {
            var traitType = TRAIT.type;
            var traitValues = TRAIT.values;
            var traitValue = traitValues[Math.floor(Math.random() * traitValues.length)];
            traits.push({ traitType: traitType, traitValue: traitValue });
        });
        return traits;
    },
};
var Dragon = /** @class */ (function () {
    function Dragon(_a) {
        var _b = _a === void 0 ? {} : _a, dragonId = _b.dragonId, birthdate = _b.birthdate, nickname = _b.nickname, traits = _b.traits, generationId = _b.generationId, isPublic = _b.isPublic, saleValue = _b.saleValue, sireValue = _b.sireValue;
        this.dragonId = dragonId || DEFAULT_PROPERTIES.dragonId;
        this.birthdate = birthdate || DEFAULT_PROPERTIES.birthdate;
        this.nickname = nickname || DEFAULT_PROPERTIES.nickname;
        this.traits = traits || DEFAULT_PROPERTIES.randomTraits;
        this.generationId = generationId || DEFAULT_PROPERTIES.generationId;
        this.isPublic = isPublic || DEFAULT_PROPERTIES.isPublic;
        this.saleValue = saleValue || DEFAULT_PROPERTIES.saleValue;
        this.sireValue = sireValue || DEFAULT_PROPERTIES.sireValue;
    }
    return Dragon;
}());
exports.default = Dragon;
