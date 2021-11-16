"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_64_1 = __importDefault(require("base-64"));
var index_1 = __importDefault(require("./index"));
var Breeder = /** @class */ (function () {
    function Breeder() {
    }
    Breeder.breederDragon = function (_a) {
        var matron = _a.matron, patron = _a.patron;
        var matronTraits = matron.traits;
        var patronTraits = patron.traits;
        var babyTraits = [];
        matronTraits.forEach(function (_a) {
            var traitType = _a.traitType, traitValue = _a.traitValue;
            var matronTrait = traitValue;
            var patronTrait = patronTraits.find(function (trait) { return trait.traitType === traitType; }).traitValue; //non-null
            babyTraits.push({
                traitType: traitType,
                traitValue: Breeder.pickTrait({ matronTrait: matronTrait, patronTrait: patronTrait }),
            });
        });
        return new index_1.default({ nickname: 'Unnamed baby', traits: babyTraits });
    };
    // Two incoming traits: matronTrait and patronTrait
    // The matronTrait and patronTrait string values are encoded.
    // Both traits have their characters summed.
    // Get a range by adding both character sums.
    // Generate a random number, in that range.
    // If the number is less than the matron's character sum, pick matron.
    // Else, pick patron.
    Breeder.pickTrait = function (_a) {
        var matronTrait = _a.matronTrait, patronTrait = _a.patronTrait;
        if (matronTrait === patronTrait)
            return matronTrait;
        var matronTraitCharSum = Breeder.charSum(base_64_1.default.encode(matronTrait));
        var patronTraitCharSum = Breeder.charSum(base_64_1.default.encode(patronTrait));
        var randNum = Math.floor(Math.random() * (matronTraitCharSum + patronTraitCharSum));
        return randNum < matronTraitCharSum ? matronTrait : patronTrait;
    };
    Breeder.charSum = function (string) {
        return string.split('').reduce(function (sum, character) { return (sum += character.charCodeAt(0)); }, 0);
    };
    return Breeder;
}());
exports.default = Breeder;
