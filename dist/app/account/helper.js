"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_js_1 = require("crypto-js");
var index_1 = __importDefault(require("../../bin/index"));
var hash = function (string) {
    return crypto_js_1.SHA256("" + index_1.default + string + index_1.default).toString();
};
exports.default = hash;
