"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tweetnacl_1 = require("tweetnacl");
var tweetnacl_util_1 = require("tweetnacl-util");
var pbkdf2_1 = __importDefault(require("pbkdf2"));
exports.generateSalt = function () {
    return tweetnacl_util_1.encodeBase64(tweetnacl_1.randomBytes(32));
};
exports.keyFromPassword = function (password, salt) {
    return pbkdf2_1.default.pbkdf2Sync(password, salt, 10000, 32, "sha512");
};
exports.symetricEncrypt = function (json, key) {
    var nonce = tweetnacl_1.randomBytes(tweetnacl_1.secretbox.nonceLength);
    var messageUint8 = tweetnacl_util_1.decodeUTF8(JSON.stringify(json));
    var box = tweetnacl_1.secretbox(messageUint8, nonce, key);
    var fullMessage = new Uint8Array(nonce.length + box.length);
    fullMessage.set(nonce);
    fullMessage.set(box, nonce.length);
    var base64FullMessage = tweetnacl_util_1.encodeBase64(fullMessage);
    return base64FullMessage;
};
exports.symetricDecrypt = function (messageWithNonce, key) {
    var messageWithNonceAsUint8Array = tweetnacl_util_1.decodeBase64(messageWithNonce);
    var nonce = messageWithNonceAsUint8Array.slice(0, tweetnacl_1.secretbox.nonceLength);
    var message = messageWithNonceAsUint8Array.slice(tweetnacl_1.secretbox.nonceLength, messageWithNonce.length);
    var decrypted = tweetnacl_1.secretbox.open(message, nonce, key);
    if (!decrypted) {
        throw new Error("Could not decrypt message");
    }
    var base64DecryptedMessage = tweetnacl_util_1.encodeUTF8(decrypted);
    return JSON.parse(base64DecryptedMessage);
};
// TEST
// const salt = generateSalt();
// const key = keyFromPassword("test42", salt);
// const encrypted = symetricEncrypt({ foo: 42 }, key);
// const decrypted = symetricDecrypt(encrypted, key);
// console.log(decrypted);
//# sourceMappingURL=index.js.map