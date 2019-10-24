import sodium from "libsodium-wrappers";

export async function generatePasswordSalt() {
  await sodium.ready;
  return sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
}

export async function generateKeyFromPassword(
  password: string,
  salt: Uint8Array
) {
  await sodium.ready;
  // ops limit & mem limit have been chosen to be slow, but still reasonably fast on mobile
  // (300ms on 2019 high end android, 4s on older low end android)
  return sodium.crypto_pwhash(
    32,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_MIN,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );
}

export async function encrypt(message: string | Uint8Array, key: Uint8Array) {
  await sodium.ready;
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(message, nonce, key);

  const combined = new Uint8Array(nonce.length + ciphertext.length);
  combined.set(nonce);
  combined.set(ciphertext, nonce.length);

  return combined;
}

export async function decrypt(
  nonce_and_ciphertext: Uint8Array,
  key: Uint8Array
) {
  await sodium.ready;
  if (
    nonce_and_ciphertext.length <
    sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES
  ) {
    throw "Short message";
  }
  let nonce = nonce_and_ciphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES),
    ciphertext = nonce_and_ciphertext.slice(sodium.crypto_secretbox_NONCEBYTES);
  return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
}
