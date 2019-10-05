// Helper
import { success, clientError } from "../helper/response";
import { APIGatewayEvent } from "aws-lambda";
import speakeasy from "speakeasy";
import secret from "../../secrets/otp/secret.json";
import jwt from "jsonwebtoken";
import * as fs from "fs";

function generateId() {
  const length = 8;
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getOTP(event) {
  const { body } = event;
  console.log('body', typeof body);
  const parsedBody = JSON.parse(body);
  return parsedBody.otp as string;
}

export const handler = async (event: APIGatewayEvent) => {
  let otp;
  try {
    otp = getOTP(event);
  } catch(e) {
    return clientError({message: "error parsing otp"});
  }

  const verified = speakeasy.totp.verify({ 
    secret: secret.base32,
    encoding: 'base32',
    token: otp 
  });

  if (!verified) {
    return clientError({message: "invalid otp"});
  }

  const privateKey = fs.readFileSync(__dirname + "/../../secrets/jwt/private_key.pem");
  const token = jwt.sign({
    id: generateId(),
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
  }, privateKey, { algorithm: 'RS256'});

  return success({token})
};