"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicDragons = exports.getDragonWithTraits = void 0;
var databasePool_1 = __importDefault(require("../../databasePool"));
var index_1 = __importDefault(require("./index"));
var table_1 = __importDefault(require("./table"));
var getDragonWithTraits = function (_a) {
    var dragonId = _a.dragonId;
    return Promise.all([
        table_1.default.getDragon({ dragonId: dragonId }),
        new Promise(function (resolve, reject) {
            databasePool_1.default.query("SELECT \"traitType\", \"traitValue\" \n                FROM trait \n                INNER JOIN dragonTrait ON trait.id = dragonTrait.\"traitId\"\n                WHERE dragonTrait.\"dragonId\" = $1", [dragonId], function (error, response) {
                if (error)
                    reject(error);
                resolve(response.rows);
            });
        }),
    ])
        .then(function (_a) {
        var dragon = _a[0], dragonTraits = _a[1];
        return new index_1.default(__assign(__assign({}, dragon), { dragonId: dragonId, traits: dragonTraits }));
    })
        .catch(function (error) {
        throw error;
    });
};
exports.getDragonWithTraits = getDragonWithTraits;
var getPublicDragons = function () {
    return new Promise(function (resolve, reject) {
        databasePool_1.default.query('SELECT id FROM dragon WHERE "isPublic" = True', function (error, response) {
            if (error)
                return reject(error);
            var publicDragonRows = response.rows;
            Promise.all(publicDragonRows.map(function (_a) {
                var id = _a.id;
                return getDragonWithTraits({ dragonId: id });
            }))
                .then(function (dragons) { return resolve({ dragons: dragons }); })
                .catch(function (error) { return reject(error); });
        });
    });
};
exports.getPublicDragons = getPublicDragons;
