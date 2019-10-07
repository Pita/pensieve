// Helper
import { success } from "./response";
import { APIGatewayEvent, Handler } from "aws-lambda";

export const handler: Handler<APIGatewayEvent> = async (event: APIGatewayEvent) => {
  return success({ok: true})
};