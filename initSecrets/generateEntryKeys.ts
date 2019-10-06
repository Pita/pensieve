import { secretbox, randomBytes, box, hash } from "tweetnacl";
import {
  decodeUTF8,
  encodeBase64,
} from "tweetnacl-util";
import prompts from "prompts";
import * as fs from "fs";

const newNonce = () => randomBytes(secretbox.nonceLength);

const keyFromPassword = (password: string) => {
  return hash(decodeUTF8(password)).slice(0, 32);
}

// TODO: move this to a central position
export const encrypt = (json: any, key: Uint8Array) => {
  const nonce = newNonce();
  const messageUint8 = decodeUTF8(JSON.stringify(json));
  const box = secretbox(messageUint8, nonce, key);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

(async() => {
  const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const passwordError = "Password too weak, needs: 1 captial letter, 1 lowercase letter, 1 number, 1 special charachter, min length 8"
  const validate = (value: string) => passwordRegex.test(value) ? true : passwordError;

  const writePassword = (await prompts(
    {
      type: 'password',
      name: 'value',
      message: 'What password do you want to use to WRITE entries? This one is less sensitive than the read password.',
      validate
    },
  )).value;

  const readPassword = (await prompts(
    {
      type: 'password',
      name: 'value',
      message: 'What password do you want to use to READ entries? This one should be much stronger.',
      validate: (readPassword: string) => {
        if (readPassword === writePassword) {
          return "Should be different from the write password";
        }

        return validate(readPassword);
      }
    }
  )).value;

  const keyPairWrite = box.keyPair();
  const keyPairRead = box.keyPair();

  const keys = {
    write: {
      public: encodeBase64(keyPairWrite.publicKey),
      secretEncrypted: encrypt(
        encodeBase64(keyPairWrite.secretKey),
        keyFromPassword(writePassword)
      ),
    },
    read: {
      public: encodeBase64(keyPairRead.publicKey),
      secretEncrypted: encrypt(
        encodeBase64(keyPairRead.secretKey),
        keyFromPassword(readPassword)
      ),
    },
  }

  fs.writeFileSync("../secrets/entry/keys.json", JSON.stringify(keys, null, 2), "utf8"); 
})()