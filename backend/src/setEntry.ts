// Helper
import { success, clientError } from "./response";
import { APIGatewayEvent, Handler } from "aws-lambda";
import secrets from "./secrets.json";
import jwt from "jsonwebtoken";

function verifyJWT(event: APIGatewayEvent) {
  // TODO: this needs to be more robust
  const token = event.headers['authorization'].split(" ")[1];
  const decoded = jwt.verify(token, secrets.jwt.public);
}

function getEntryData(event) {
    const { body } = event;
    const parsedBody = JSON.parse(body);
    return parsedBody.otp as string;
}

// middy 
// middy jwt 
// https://www.npmjs.com/package/middy-middleware-jwt-auth
export const handler: Handler<APIGatewayEvent> = async (event: APIGatewayEvent) => {
  try {
    verifyJWT(event);
  } catch(e) {
    return clientError({message: "Invalid jwt"});
  }

  const token = jwt.sign({
    id: generateId(),
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
  }, secrets.jwt.private, { algorithm: 'RS256'});

  return success({token})
};