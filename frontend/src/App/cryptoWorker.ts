import registerPromiseWorker from "promise-worker/register";
import { WorkerRequest, WorkerResponse } from "./workerMessages";
import sharedCrypto from "sharedCrypto";

registerPromiseWorker(
  async (message: WorkerRequest): Promise<WorkerResponse> => {
    switch (message.type) {
      case "PasswordHashRequest":
        const salt = await sharedCrypto.helper.from_base64(message.salt);
        const password = message.password;
        const key = await sharedCrypto.sync.generateKeyFromPassword(
          password,
          salt
        );
        return {
          type: "PasswordHashResponse",
          key: await sharedCrypto.helper.to_base64(key)
        };
        break;
    }
  }
);

// const ctx: Worker = self as any;

// ctx.addEventListener("message", startCounter);

// function startCounter(event: any) {
//   console.log(event.data, self);
//   let initial = event.data;
//   setInterval(() => ctx.postMessage(initial++), 1000);
// }

export {};
