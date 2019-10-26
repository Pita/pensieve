import libsodium from "libsodium-wrappers";

export const from_base64 = async (input: string) => {
  await libsodium.ready;
  return libsodium.from_base64(input);
};
export const to_base64 = async (input: Uint8Array) => {
  await libsodium.ready;
  return libsodium.to_base64(input);
};
