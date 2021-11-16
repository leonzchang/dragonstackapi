"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var table_1 = __importDefault(require("./table"));
var GenerationEngine = /** @class */ (function () {
    function GenerationEngine() {
        this.generation;
        this.timer;
    }
    GenerationEngine.prototype.start = function () {
        this.buildNewGeneration();
    };
    GenerationEngine.prototype.stop = function () {
        clearTimeout(this.timer);
    };
    GenerationEngine.prototype.buildNewGeneration = function () {
        var _this = this;
        var generation = new index_1.default();
        table_1.default.storeGeneration(generation)
            .then(function (_a) {
            var generationId = _a.generationId;
            _this.generation = generation;
            _this.generation.generationId = generationId;
            console.log('new generation', _this.generation);
            _this.timer = setTimeout(function () {
                _this.buildNewGeneration();
            }, _this.generation.expiration.getTime() - Date.now());
        })
            .catch(function (error) { return console.error(error); });
    };
    return GenerationEngine;
}());
exports.default = GenerationEngine;
