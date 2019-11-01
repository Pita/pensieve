import axios, { AxiosResponse } from "axios";

console.log("process.env.REACT_APP_BACKEND", process.env.REACT_APP_BACKEND);
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND
});

interface APIResponse<T> {
  status: string;
  data: T;
}

export interface StartSessionResponse {
  token: string;
  entrySecrets: {
    write: {
      public: string;
      secretEncrypted: string;
      secretPasswordSalt: string;
    };
    read: {
      public: string;
      secretEncrypted: string;
      secretPasswordSalt: string;
    };
  };
}

export async function startSession(
  otp: string
): Promise<AxiosResponse<APIResponse<StartSessionResponse>>> {
  return await instance.post("/startSession", { otp });
}
