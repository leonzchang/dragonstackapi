"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var databaseConfiguration_1 = __importDefault(require("./bin/databaseConfiguration"));
var pool = new pg_1.Pool(databaseConfiguration_1.default);
exports.default = pool;
