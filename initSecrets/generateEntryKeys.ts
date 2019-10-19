import { secretbox, randomBytes, box, hash } from "tweetnacl";
import { decodeUTF8, encodeBase64 } from "tweetnacl-util";
import prompts from "prompts";
import * as fs from "fs";
import pbkdf2 from "pbkdf2";

const newNonce = () => randomBytes(secretbox.nonceLength);

const generateSalt = () => {
  return encodeBase64(randomBytes(32));
};

const keyFromPassword = (password: string, salt: string): Uint8Array => {
  // TODO: increase to 10000 as we'll use webworkers for this
  return pbkdf2.pbkdf2Sync(password, salt, 5000, 32, "sha512");
};

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

(async () => {
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  const passwordError =
    "Password too weak, needs: 1 captial letter, 1 lowercase letter, 1 number, 1 special charachter, min length 8";
  const validate = (value: string) =>
    passwordRegex.test(value) ? true : passwordError;

  const writePassword = (await prompts({
    type: "password",
    name: "value",
    message:
      "What password do you want to use to WRITE entries? This one is less sensitive than the read password.",
    validate
  })).value;

  await prompts({
    type: "password",
    name: "value",
    message: "Please repeat your WRITE password",
    validate: (writePasswordConfirm: string) => {
      if (writePasswordConfirm !== writePassword) {
        return "That is not the same password, repeat the password correctly or press CTRL+C and restart";
      }

      return true;
    }
  });

  const readPassword = (await prompts({
    type: "password",
    name: "value",
    message:
      "What password do you want to use to READ entries? This one should be much stronger.",
    validate: (readPassword: string) => {
      if (readPassword === writePassword) {
        return "Should be different from the write password";
      }

      return validate(readPassword);
    }
  })).value;

  await prompts({
    type: "password",
    name: "value",
    message: "Please repeat your READ password",
    validate: (readPasswordConfirm: string) => {
      if (readPasswordConfirm !== readPassword) {
        return "That is not the same password, repeat the password correctly or press CTRL+C and restart";
      }

      return true;
    }
  });

  const keyPairWrite = box.keyPair();
  const keyPairRead = box.keyPair();

  const writeSalt = generateSalt();
  const readSalt = generateSalt();
  const keys = {
    write: {
      public: encodeBase64(keyPairWrite.publicKey),
      secretEncrypted: encrypt(
        encodeBase64(keyPairWrite.secretKey),
        keyFromPassword(writePassword, writeSalt)
      ),
      secretPasswordSalt: writeSalt
    },
    read: {
      public: encodeBase64(keyPairRead.publicKey),
      secretEncrypted: encrypt(
        encodeBase64(keyPairRead.secretKey),
        keyFromPassword(readPassword, readSalt)
      ),
      secretPasswordSalt: readSalt
    }
  };

  fs.writeFileSync(
    "../secrets/entry/keys.json",
    JSON.stringify(keys, null, 2),
    "utf8"
  );
})();
