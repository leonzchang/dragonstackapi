"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSession = exports.authenticatedAccount = void 0;
var helper_1 = __importDefault(require("../account/helper"));
var session_1 = __importDefault(require("../account/session"));
var table_1 = __importDefault(require("../account/table"));
var setSession = function (_a) {
    var username = _a.username, res = _a.res, sessionId = _a.sessionId;
    return new Promise(function (resolve, reject) {
        var session, sessionString;
        if (sessionId) {
            sessionString = session_1.default.sessionString({ username: username, id: sessionId });
            setSessionCookie({ sessionString: sessionString, res: res });
            resolve({ message: 'session restored' });
        }
        else {
            session = new session_1.default({ username: username });
            sessionString = session.toString();
            table_1.default.updateSessionId({
                sessionId: session.id,
                usernameHash: helper_1.default(username),
            })
                .then(function () {
                setSessionCookie({ sessionString: sessionString, res: res });
                resolve({ message: 'session created' });
            })
                .catch(function (error) { return reject(error); });
        }
    });
};
exports.setSession = setSession;
var setSessionCookie = function (_a) {
    var sessionString = _a.sessionString, res = _a.res;
    res.cookie('sessionString', sessionString, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
        // secure:true  //use with https
    });
};
var authenticatedAccount = function (_a) {
    var sessionString = _a.sessionString;
    return new Promise(function (resolve, reject) {
        if (!sessionString || !session_1.default.verify(sessionString)) {
            var error = new Error('Invalid session');
            error.statusCode = 400;
            reject(error);
        }
        else {
            var _a = session_1.default.parse(sessionString), username_1 = _a.username, id_1 = _a.id;
            table_1.default.getAccount({ usernameHash: helper_1.default(username_1) })
                .then(function (_a) {
                var account = _a.account;
                var authenticated = account.sessionId === id_1;
                resolve({ account: account, authenticated: authenticated, username: username_1 });
            })
                .catch(function (error) { return reject(error); });
        }
    });
};
exports.authenticatedAccount = authenticatedAccount;
