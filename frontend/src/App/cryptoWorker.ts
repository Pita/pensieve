import registerPromiseWorker from "promise-worker/register";
import {
  WorkerRequest,
  WorkerResponse,
  CheckPasswordRequest,
  CheckPasswordCorrectResponse,
  CheckPasswordIncorrectResponse
} from "./workerMessages";
import sharedCrypto from "sharedCrypto";

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
    return {
      type: "CheckPasswordCorrectResponse",
      decryptedKey: await sharedCrypto.helper.to_base64(decryptedKey)
    };
  } catch (e) {
    console.error(e);
    return {
      type: "CheckPasswordIncorrectResponse"
    };
  }
}

export {};
