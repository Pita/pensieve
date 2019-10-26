# Init Secrets

Sub system to generate all necassary secrets and export them as a json file to the backend. Current secret types are:

- Entry keys (to encrypt and decrypt the diary entries)
- OTP secret (seed to generate the one time passwords)
- JWT private & public key (for signing and verifying the jwt tokens)

## Generate all secrets

```
yarn install
./init.sh
```

## Regenerate specific secret (e.g. otp)

```
rm -rf ../secrets/otp
./init.sh
```
