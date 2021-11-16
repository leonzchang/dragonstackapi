"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var helper_1 = __importDefault(require("../account/helper"));
var session_1 = __importDefault(require("../account/session"));
var table_1 = __importDefault(require("../account/table"));
var table_2 = __importDefault(require("../accountDragon/table"));
var helper_2 = require("../dargon/helper");
var helper_3 = require("./helper");
var router = express_1.Router();
router.post('/signup', function (req, res, next) {
    var _a = req.body, username = _a.username, password = _a.password;
    var usernameHash = helper_1.default(username);
    var passwordHash = helper_1.default(password);
    table_1.default.getAccount({ usernameHash: usernameHash })
        .then(function (_a) {
        var account = _a.account;
        if (!account) {
            return table_1.default.storeAccount({ usernameHash: usernameHash, passwordHash: passwordHash });
        }
        else {
            var error = new Error('This username has already been taken');
            error.statusCode = 409;
            throw error;
        }
    })
        .then(function () {
        return helper_3.setSession({ username: username, res: res });
    })
        .then(function (_a) {
        var message = _a.message;
        res.json({ message: message });
    })
        .catch(function (error) { return next(error); });
});
router.post('/login', function (req, res, next) {
    var _a = req.body, username = _a.username, password = _a.password;
    table_1.default.getAccount({ usernameHash: helper_1.default(username) })
        .then(function (_a) {
        var account = _a.account;
        if (account && account.passwordHash === helper_1.default(password)) {
            var sessionId = account.sessionId;
            return helper_3.setSession({ username: username, res: res, sessionId: sessionId });
        }
        else {
            var error = new Error('Incorrect username/password');
            error.statusCode = 409;
            throw error;
        }
    })
        .then(function (_a) {
        var message = _a.message;
        return res.json({ message: message });
    })
        .catch(function (error) { return next(error); });
});
router.get('/logout', function (req, res, next) {
    var username = session_1.default.parse(req.cookies.sessionString).username;
    table_1.default.updateSessionId({
        sessionId: null,
        usernameHash: helper_1.default(username),
    })
        .then(function () {
        res.clearCookie('sessionString');
        res.json({ message: 'Successful logout' });
    })
        .catch(function (error) { return next(error); });
});
router.get('/authenticated', function (req, res, next) {
    helper_3.authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(function (_a) {
        var authenticated = _a.authenticated;
        return res.json({ authenticated: authenticated });
    })
        .catch(function (error) { return next(error); });
});
router.get('/dragons', function (req, res, next) {
    helper_3.authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(function (_a) {
        var account = _a.account;
        return table_2.default.getAccountDragon({
            accountId: account.id,
        });
    })
        .then(function (_a) {
        var accountDragons = _a.accountDragons;
        return Promise.all(accountDragons.map(function (accountDragon) {
            return helper_2.getDragonWithTraits({ dragonId: accountDragon.dragonId });
        }));
    })
        .then(function (dragons) {
        res.json({ dragons: dragons });
    })
        .catch(function (error) { return next(error); });
});
router.get('/info', function (req, res, next) {
    helper_3.authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(function (_a) {
        var account = _a.account, username = _a.username;
        res.json({ info: { balance: account.balance, username: username } });
    })
        .catch(function (error) { return next(error); });
});
exports.default = router;
