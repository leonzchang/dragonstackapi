"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var account_1 = __importDefault(require("./api/account"));
var dragon_1 = __importDefault(require("./api/dragon"));
var generation_1 = __importDefault(require("./api/generation"));
var engine_1 = __importDefault(require("./generation/engine"));
var app = express_1.default();
var engine = new engine_1.default();
app.locals.engine = engine;
app.use(cors_1.default({ origin: 'http://localhost:1234', credentials: true }));
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use('/account', account_1.default);
app.use('/dragon', dragon_1.default);
app.use('/generation', generation_1.default);
app.use(function (error, req, res, next) {
    var statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        type: 'error',
        message: error.message,
    });
});
engine.start();
exports.default = app;
