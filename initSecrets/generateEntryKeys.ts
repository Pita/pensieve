import prompts from "prompts";
import * as fs from "fs";
import sharedCrypto from "sharedCrypto";

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

  const keyPairWrite = await sharedCrypto.async.generateKeyPair();
  const keyPairRead = await sharedCrypto.async.generateKeyPair();

  const writeSalt = await sharedCrypto.sync.generatePasswordSalt();
  const readSalt = await sharedCrypto.sync.generatePasswordSalt();

  const writeKey = await sharedCrypto.sync.generateKeyFromPassword(
    writePassword,
    writeSalt
  );
  const readKey = await sharedCrypto.sync.generateKeyFromPassword(
    readPassword,
    readSalt
  );

  const encryptedWriteSecret = await sharedCrypto.sync.encrypt(
    keyPairWrite.privateKey,
    writeKey
  );
  const encryptedReadSecret = await sharedCrypto.sync.encrypt(
    keyPairRead.privateKey,
    readKey
  );

  const keys = {
    write: {
      public: sharedCrypto.helper.to_base64(keyPairWrite.publicKey),
      secretEncrypted: sharedCrypto.helper.to_base64(encryptedWriteSecret),
      secretPasswordSalt: sharedCrypto.helper.to_base64(writeSalt)
    },
    read: {
      public: sharedCrypto.helper.to_base64(keyPairRead.publicKey),
      secretEncrypted: sharedCrypto.helper.to_base64(encryptedReadSecret),
      secretPasswordSalt: sharedCrypto.helper.to_base64(readSalt)
    }
  };

  fs.writeFileSync(
    "../secrets/entry/keys.json",
    JSON.stringify(keys, null, 2),
    "utf8"
  );
})();
