import { box, randomBytes } from "tweetnacl";
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} from "tweetnacl-util";

const newNonce = () => randomBytes(box.nonceLength);
export const generateKeyPair = () => box.keyPair();

export const encrypt = (
  secretOrSharedKey: Uint8Array,
  json: any,
  key?: Uint8Array
) => {
  const nonce = newNonce();
  const messageUint8 = decodeUTF8(JSON.stringify(json));
  const encrypted = key
    ? box(messageUint8, nonce, key, secretOrSharedKey)
    : box.after(messageUint8, nonce, secretOrSharedKey);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

export const decrypt = (
  secretOrSharedKey: Uint8Array,
  messageWithNonce: string,
  key?: Uint8Array
) => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length
  );

  const decrypted = key
    ? box.open(message, nonce, key, secretOrSharedKey)
    : box.open.after(message, nonce, secretOrSharedKey);

  if (!decrypted) {
    throw new Error("Could not decrypt message");
  }

  const base64DecryptedMessage = encodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};

const pairA = generateKeyPair();
const pairB = generateKeyPair();
const sharedA = box.before(pairB.publicKey, pairA.secretKey);
const sharedB = box.before(pairA.publicKey, pairB.secretKey);

const encryptedDates = [];
const value = new Date().toISOString();
for (let i = 0; i < 1000; i++) {
  encryptedDates.push(encrypt(sharedA, value));
  // console.log(encryptedDates[i]);
}

const start = Date.now();
for (let i = 0; i < 1000; i++) {
  const decrypted = decrypt(sharedB, encryptedDates[i]);
  console.log(decrypted);
}
console.log("time", Date.now() - start);
