import registerPromiseWorker from "promise-worker/register";
import {
  CheckPasswordRequest,
  CheckPasswordResponse,
  EncryptEntryRequest,
  EncryptEntryResponse,
  WorkerFunction
} from "./workerMessages";
import sharedCrypto from "sharedCrypto";
import uuid from 'uuid/v4';

const keys: Map<string, Uint8Array> = new Map();

const workerCallback: WorkerFunction = async (message: any): Promise<any> => {
  switch (message.type) {
    case "CheckPasswordRequest":
      return await checkPassword(message);
    case "EncryptEntryRequest":
      return await encryptEntry(message);
  }

  throw new Error("Unkown message");
}
registerPromiseWorker(workerCallback);

async function encryptEntry(
  message: EncryptEntryRequest
): Promise<EncryptEntryResponse> {
  return {
    type: "EncryptEntryResponse",
    encryptedEnry: "dummy",
  };
}

async function checkPassword(
  message: CheckPasswordRequest
): Promise<CheckPasswordResponse> {
  const salt = await sharedCrypto.helper.from_base64(message.salt);
  const password = message.password;
  const key = await sharedCrypto.sync.generateKeyFromPassword(password, salt);
  const encryptedKey = await sharedCrypto.helper.from_base64(
    message.encryptedKey
  );
  try {
    const decryptedKey = await sharedCrypto.sync.decrypt(encryptedKey, key);
    const keyID = uuid();
    keys.set(keyID, decryptedKey);
    return {
      type: "CheckPasswordCorrectResponse",
      keyID
    };
  } catch (e) {
    console.error(e);
    return {
      type: "CheckPasswordIncorrectResponse"
    };
  }
}

export {};
