export declare const generateSalt: () => string;
export declare const keyFromPassword: (password: string, salt: string) => Uint8Array;
export declare const symetricEncrypt: (json: any, key: Uint8Array) => string;
export declare const symetricDecrypt: (messageWithNonce: string, key: Uint8Array) => any;
