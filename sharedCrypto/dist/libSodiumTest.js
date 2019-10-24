"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
// (async () => {
//   await libsodium.ready;
//   const sodium = libsodium;
//   const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
//   const start = Date.now();
//   const hash = sodium.crypto_pwhash(
//     32,
//     sodium.from_string("password"),
//     salt,
//     sodium.crypto_pwhash_OPSLIMIT_MIN,
//     sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
//     sodium.crypto_pwhash_ALG_ARGON2ID13
//   );
//   const end = Date.now();
//   console.log("time", end - start);
// })().catch(e => console.error(e));
// (async () => {
//   await libsodium.ready;
//   const sodium = libsodium;
//   function encrypt_and_prepend_nonce(
//     message: string | Uint8Array,
//     key: Uint8Array
//   ) {
//     const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
//     const ciphertext = sodium.crypto_secretbox_easy(message, nonce, key);
//     const combined = new Uint8Array(nonce.length + ciphertext.length);
//     combined.set(nonce);
//     combined.set(ciphertext, nonce.length);
//     return combined;
//   }
//   function decrypt_after_extracting_nonce(
//     nonce_and_ciphertext: Uint8Array,
//     key: Uint8Array
//   ) {
//     if (
//       nonce_and_ciphertext.length <
//       sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES
//     ) {
//       throw "Short message";
//     }
//     let nonce = nonce_and_ciphertext.slice(
//         0,
//         sodium.crypto_secretbox_NONCEBYTES
//       ),
//       ciphertext = nonce_and_ciphertext.slice(
//         sodium.crypto_secretbox_NONCEBYTES
//       );
//     return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
//   }
//   const key = sodium.randombytes_buf(32);
//   const encrypted = encrypt_and_prepend_nonce("test", key);
//   const decrypted = decrypt_after_extracting_nonce(encrypted, key);
//   console.log("result", sodium.to_string(decrypted));
// })().catch(e => console.error(e));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var sodium, alice, bob, nonce, encrypted, decrypted;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, libsodium_wrappers_1.default.ready];
            case 1:
                _a.sent();
                sodium = libsodium_wrappers_1.default;
                alice = sodium.crypto_box_keypair();
                bob = sodium.crypto_box_keypair();
                nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
                encrypted = sodium.crypto_box_easy("Dear Bob", nonce, bob.publicKey, alice.privateKey);
                decrypted = sodium.crypto_box_open_easy(encrypted, nonce, alice.publicKey, bob.privateKey);
                console.log("result", sodium.to_string(decrypted));
                return [2 /*return*/];
        }
    });
}); })().catch(function (e) { return console.error(e); });
//# sourceMappingURL=libSodiumTest.js.map