import sodium from "libsodium-wrappers";

export async function generateKeyPair() {
  await sodium.ready;
  return sodium.crypto_box_keypair();
}

export async function encrypt(
  message: string | Uint8Array,
  publicKey: Uint8Array,
  privateKey: Uint8Array
) {
  await sodium.ready;

  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  const ciphertext = sodium.crypto_box_easy(
    message,
    nonce,
    publicKey,
    privateKey
  );

  const combined = new Uint8Array(nonce.length + ciphertext.length);
  combined.set(nonce);
  combined.set(ciphertext, nonce.length);

  return combined;
}

export async function decrypt(
  nonce_and_ciphertext: Uint8Array,
  key: Uint8Array,
  privateKey: Uint8Array,
  publicKey: Uint8Array
) {
  await sodium.ready;

  const nonce = nonce_and_ciphertext.slice(0, sodium.crypto_box_NONCEBYTES);
  const ciphertext = nonce_and_ciphertext.slice(sodium.crypto_box_NONCEBYTES);

  const decrypted = sodium.crypto_box_open_easy(
    ciphertext,
    nonce,
    publicKey,
    privateKey
  );

  return decrypted;
}
