// Helper
import { success, clientError } from "./response";
import { APIGatewayEvent, Handler } from "aws-lambda";
import speakeasy from "speakeasy";
import secrets from "./secrets.json";
import jwt from "jsonwebtoken";

function generateId() {
  const length = 8;
  let result             = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getOTP(event) {
  const { body } = event;
  const parsedBody = JSON.parse(body);
  return parsedBody.otp as string;
}

export const handler: Handler<APIGatewayEvent> = async (event: APIGatewayEvent) => {
  let otp;
  try {
    otp = getOTP(event);
  } catch(e) {
    return clientError({message: "error parsing otp"});
  }

  const verified = speakeasy.totp.verify({ 
    secret: secrets.otp.secret,
    encoding: 'base32',
    token: otp 
  });

  if (!verified) {
    return clientError({message: "invalid otp"});
  }

  const token = jwt.sign({
    id: generateId(),
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
  }, secrets.jwt.private, { algorithm: 'RS256'});

  return success({token, entrySecrets: secrets.entry})
};