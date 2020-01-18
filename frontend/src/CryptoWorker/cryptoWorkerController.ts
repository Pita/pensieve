// eslint-disable-next-line
import CryptoWorker from "worker-loader!./cryptoWorker";
import PromiseWorker from "promise-worker";
import {
  WorkerFunction,
} from "../CryptoWorker/workerMessages";

const worker = new PromiseWorker(new CryptoWorker());

export const sendMessageToWorker: WorkerFunction = async (message: any) => {
  return await worker.postMessage(message)
}