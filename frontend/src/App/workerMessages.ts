export type PasswordHashRequest = {
  type: "PasswordHashRequest";
  password: string;
  salt: string;
};

export type PasswordHashResponse = {
  type: "PasswordHashResponse";
  key: string;
};

export type WorkerRequest = PasswordHashRequest;
export type WorkerResponse = PasswordHashResponse;
