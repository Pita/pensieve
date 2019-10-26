# Pensieve (WORK IN PROGRESS)

The goal is to create a secure diary hosted in the cloud. Name is inspired by [the Pensieve of Harry Potter](https://harrypotter.fandom.com/wiki/Pensieve)

## Features

- Works on a wide variety of devices (responsive layout, material ui, web interface)
- 2 Passwords, one for reading and one for writing. Most of the time you only need to write entries, if the write password gets leaked, an attacker still can't read any entries. Made possible with async encryption.
- 2 Factor Auth through OTP. The backend only responds to you if you can provide a correct OTP with the first API call. In exchange the client gets a JWT to authenticate for further calls.
- All cryptographic operations happen in the browser. The cloud backend only ever sees encrypted data.
- Strong encryption thanks to libsodium (fast thanks to WASM, non UI blocking thanks to Web Workers)
- Ability to extend as wished (e.g. record mood score every day, ask custom questions to answer), maybe archived with plugin system if this can be implemented securely (maybe with sandboxed code executed in lambda)
