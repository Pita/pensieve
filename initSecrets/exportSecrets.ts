import * as fs from "fs";

const entry = require("../secrets/entry/keys.json");

const backend = {
  jwt: {
    private: fs.readFileSync("../secrets/jwt/private_key.pem", "utf8"),
    public: fs.readFileSync("../secrets/jwt/private_key.pem", "utf8"),
  },
  otp: {
    secret: require("../secrets/otp/secret.json").base32,
  },
  entry: {
    read: {
      public: entry.read.public,
    },
  }
}

const frontend = {
  entry,
}

fs.writeFileSync("../backend/src/secrets.json", JSON.stringify(backend, null, 2), "utf8");
fs.writeFileSync("../frontend/src/secrets.json", JSON.stringify(frontend, null, 2), "utf8");