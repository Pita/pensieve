export declare function generatePasswordSalt(): Promise<Uint8Array>;
export declare function generateKeyFromPassword(password: string, salt: Uint8Array): Promise<Uint8Array>;
export declare function encrypt(message: string | Uint8Array, key: Uint8Array): Promise<Uint8Array>;
export declare function decrypt(nonce_and_ciphertext: Uint8Array, key: Uint8Array): Promise<Uint8Array>;
