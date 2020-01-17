import registerPromiseWorker from "promise-worker/register";
import {
  WorkerRequest,
  WorkerResponse,
  CheckPasswordRequest,
  CheckPasswordCorrectResponse,
  CheckPasswordIncorrectResponse
} from "./workerMessages";
import sharedCrypto from "sharedCrypto";
import uuid from 'uuid/v4';

const keys: Map<string, Uint8Array> = new Map();

registerPromiseWorker(
  async (message: WorkerRequest): Promise<WorkerResponse> => {
    switch (message.type) {
      case "CheckPasswordRequest":
        return await checkPassword(message);
    }
  }
);

async function checkPassword(
  message: CheckPasswordRequest
): Promise<CheckPasswordCorrectResponse | CheckPasswordIncorrectResponse> {
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
