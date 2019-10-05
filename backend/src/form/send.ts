// Helper
import { success } from "../helper/response";

export const handler = async (event: any) => {
  // Get authkey from headers
  const { body } = event;

  // Parse body which came as a string
  const parsedBody = JSON.parse(body);

  return success({
    data: parsedBody,
  });
};
