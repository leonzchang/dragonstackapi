"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var table_1 = __importDefault(require("../account/table"));
var table_2 = __importDefault(require("../accountDragon/table"));
var breeder_1 = __importDefault(require("../dargon/breeder"));
var helper_1 = require("../dargon/helper");
var helper_2 = require("../dargon/helper");
var table_3 = __importDefault(require("../dargon/table"));
var helper_3 = require("./helper");
var router = express_1.Router();
router.get('/new', function (req, res, next) {
    var accountId, dragon;
    helper_3.authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(function (_a) {
        var account = _a.account;
        accountId = account.id;
        dragon = req.app.locals.engine.generation.newDragon({ accountId: accountId }); //each account only can get one dragon on each generation
        return table_3.default.storeDragon(dragon);
    })
        .then(function (_a) {
        var dragonId = _a.dragonId;
        dragon.dragonId = dragonId;
        return table_2.default.storeAccountDragon({ accountId: accountId, dragonId: dragonId });
    })
        .then(function () { return res.json({ dragon: dragon }); })
        .catch(function (error) { return next(error); });
});
router.put('/update', function (req, res, next) {
    var _a = req.body, dragonId = _a.dragonId, nickname = _a.nickname, isPublic = _a.isPublic, saleValue = _a.saleValue, sireValue = _a.sireValue;
    table_3.default.updateDragon({ dragonId: dragonId, nickname: nickname, isPublic: isPublic, saleValue: saleValue, sireValue: sireValue })
        .then(function () { return res.json({ message: 'Successfully updated dragon' }); })
        .catch(function (error) { return next(error); });
});
router.get('/public-dragons', function (req, res, next) {
    helper_1.getPublicDragons()
        .then(function (_a) {
        var dragons = _a.dragons;
        return res.json({ dragons: dragons });
    })
        .catch(function (error) { return next(error); });
});
router.post('/buy', function (req, res, next) {
    var _a = req.body, dragonId = _a.dragonId, saleValue = _a.saleValue;
    var buyerId;
    table_3.default.getDragon({ dragonId: dragonId })
        .then(function (dragon) {
        if (dragon.saleValue !== saleValue)
            throw new Error('Sale value is not correct'); //validation on dragon Info
        if (!dragon.isPublic)
            throw new Error('Dragon must be public');
        return helper_3.authenticatedAccount({ sessionString: req.cookies.sessionString }); //authenticated and get buyer account Info
    })
        .then(function (_a) {
        var account = _a.account, authenticated = _a.authenticated;
        if (!authenticated)
            throw new Error('Unauthenticated'); //validation on buyer account Info
        if (saleValue > account.balance)
            throw new Error('Sale value exceeds balance'); //validation on buyer account balance
        buyerId = account.id;
        return table_2.default.getDragonAccount({ dragonId: dragonId });
    })
        .then(function (_a) {
        var accountId = _a.accountId;
        if (accountId === buyerId)
            throw new Error('Can not buy your own dragon');
        var sellerId = accountId;
        return Promise.all([
            //process trading
            table_1.default.updateBalance({ accountId: buyerId, value: -saleValue }),
            table_1.default.updateBalance({ accountId: sellerId, value: saleValue }),
            table_2.default.updateDragonAccount({ accountId: buyerId, dragonId: dragonId }),
            table_3.default.updateDragon({ dragonId: dragonId, isPublic: false }), //set public to false(can not trade)
        ]);
    })
        .then(function () { return res.json({ message: 'success!' }); })
        .catch(function (error) { return next(error); });
});
router.post('/mate', function (req, res, next) {
    var _a = req.body, matronDragonId = _a.matronDragonId, patronDragonId = _a.patronDragonId;
    if (matronDragonId === patronDragonId)
        throw new Error('Can not breed with same dragon');
    var matronDragon, patronDragon, patronSireValue;
    var matronAccountId, patronAccountId;
    helper_2.getDragonWithTraits({ dragonId: patronDragonId })
        .then(function (dragon) {
        if (!dragon.isPublic)
            throw new Error('Dragon must be public');
        patronDragon = dragon;
        patronSireValue = dragon.sireValue;
        return helper_2.getDragonWithTraits({ dragonId: matronDragonId });
    })
        .then(function (dragon) {
        matronDragon = dragon;
        return helper_3.authenticatedAccount({ sessionString: req.cookies.sessionString });
    })
        .then(function (_a) {
        var account = _a.account, authenticated = _a.authenticated;
        if (!authenticated)
            throw new Error('Unauthenticated');
        if (patronSireValue > account.balance)
            throw new Error('Sire value exceeds balance');
        matronAccountId = account.id;
        return table_2.default.getDragonAccount({ dragonId: patronDragonId });
    })
        .then(function (_a) {
        var accountId = _a.accountId;
        patronAccountId = accountId;
        if (matronAccountId === patronAccountId)
            throw new Error('Can not breed your own dragons');
        var dragon = breeder_1.default.breederDragon({ matron: matronDragon, patron: patronDragon });
        return table_3.default.storeDragon(dragon);
    })
        .then(function (_a) {
        var dragonId = _a.dragonId;
        Promise.all([
            table_1.default.updateBalance({ accountId: matronAccountId, value: -patronSireValue }),
            table_1.default.updateBalance({ accountId: patronAccountId, value: patronSireValue }),
            table_2.default.storeAccountDragon({ dragonId: dragonId, accountId: matronAccountId }),
        ]);
    })
        .then(function () { return res.json({ message: 'Succes' }); })
        .catch(function (error) { return next(error); });
});
exports.default = router;
