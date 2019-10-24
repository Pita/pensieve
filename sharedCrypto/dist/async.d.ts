import sodium from "libsodium-wrappers";
export declare function generateKeyPair(): Promise<sodium.KeyPair>;
export declare function encrypt(message: string | Uint8Array, publicKey: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
export declare function decrypt(nonce_and_ciphertext: Uint8Array, key: Uint8Array, privateKey: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array>;
