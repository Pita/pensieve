// Functions
const sendResponse = (data: any = {}, statusCode: number) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  };
};

export const serverError = (data: any) => sendResponse(data, 500);
export const clientError = (data: any) => sendResponse(data, 500);
export const success = (data: any) => sendResponse(data, 200);
