# Init Secrets

Sub system to generate all necassary secrets and distribute them as json files to frontend & backend

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