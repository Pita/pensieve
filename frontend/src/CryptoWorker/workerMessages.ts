export type CheckPasswordRequest = {
  type: "CheckPasswordRequest";
  password: string;
  salt: string;
  encryptedKey: string;
};

export type CheckPasswordResponse = {
  type: "CheckPasswordCorrectResponse";
  keyID: string;
} | {
  type: "CheckPasswordIncorrectResponse";
};

export type EncryptEntryRequest = {
  type: "EncryptEntryRequest";
  keyID: string;
  entry: string;
};

export type EncryptEntryResponse = {
  type: "EncryptEntryResponse";
  encryptedEnry: string;
};

export interface WorkerFunction {
  (options: CheckPasswordRequest): Promise<CheckPasswordResponse>;
  (options: EncryptEntryRequest): Promise<EncryptEntryResponse>;
}