import { secretbox, randomBytes } from "tweetnacl";
import {
  decodeUTF8,
  encodeBase64,
  decodeBase64,
  encodeUTF8
} from "tweetnacl-util";
import pbkdf2 from "pbkdf2";

export const generateSalt = () => {
  return encodeBase64(randomBytes(32));
};

export const keyFromPassword = (password: string, salt: string): Uint8Array => {
  return pbkdf2.pbkdf2Sync(password, salt, 10000, 32, "sha512");
};

export const symetricEncrypt = (json: any, key: Uint8Array) => {
  const nonce = randomBytes(secretbox.nonceLength);
  const messageUint8 = decodeUTF8(JSON.stringify(json));
  const box = secretbox(messageUint8, nonce, key);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

export const symetricDecrypt = (messageWithNonce: string, key: Uint8Array) => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    secretbox.nonceLength,
    messageWithNonce.length
  );

  const decrypted = secretbox.open(message, nonce, key);

  if (!decrypted) {
    throw new Error("Could not decrypt message");
  }

  const base64DecryptedMessage = encodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};

// TEST
// const salt = generateSalt();
// const key = keyFromPassword("test42", salt);
// const encrypted = symetricEncrypt({ foo: 42 }, key);
// const decrypted = symetricDecrypt(encrypted, key);
// console.log(decrypted);
