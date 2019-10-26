# Shared Crypto subsystem

Here the basic crypto methods are provided as a lib to the initSecrets & frontend. This code needs to be the same to ensure the crypto works identically at both places. Its configured as a npm module but does not get published to npm. Instead, frontend & initSecrets have a file path entry in their package.json to include it. The built files are checked into git for practicality.
