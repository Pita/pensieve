import middy from "middy";
import { jsonBodyParser, validator, httpErrorHandler } from "middy/middlewares";
import speakeasy from "speakeasy";
import secrets from "./secrets.json";
import jwt from "jsonwebtoken";

function generateId() {
  const length = 8;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const startSession = async event => {
  const { otp } = event.body;

  const verified = speakeasy.totp.verify({
    secret: secrets.otp.secret,
    encoding: "base32",
    token: otp
  });

  if (!verified) {
    // TODO: Better error handling
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify({ status: "error_invalid_otp" })
    };
  }

  const token = jwt.sign(
    {
      id: generateId(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    },
    secrets.jwt.private,
    { algorithm: "RS256" }
  );

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({ status: "ok", token, entrySecrets: secrets.entry })
  };
};

const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        otp: {
          type: "string",
          pattern: "^\\d{6}$"
        }
      },
      required: ["otp"]
    }
  }
};

export const handler = middy(startSession)
  // TODO: should probably use @middy/function-shield
  // TODO: cors
  .use(jsonBodyParser())
  .use(validator({ inputSchema }))
  .use(httpErrorHandler());
