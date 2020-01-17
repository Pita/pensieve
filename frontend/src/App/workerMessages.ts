export type CheckPasswordRequest = {
  type: "CheckPasswordRequest";
  password: string;
  salt: string;
  encryptedKey: string;
};

export type CheckPasswordCorrectResponse = {
  type: "CheckPasswordCorrectResponse";
  keyID: string;
};
export type CheckPasswordIncorrectResponse = {
  type: "CheckPasswordIncorrectResponse";
};

export type WorkerRequest = CheckPasswordRequest;
export type WorkerResponse =
  | CheckPasswordCorrectResponse
  | CheckPasswordIncorrectResponse;
