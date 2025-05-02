import { ZodError } from "zod";
import ApiError from "../ApiError/ApiError";
import { ErrorResponse } from "../response/response";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const catchAsync = (RequestHandler: any) => async (req: Request) => {
  try {
    return await RequestHandler(req);
  } catch (error) {
    if (error instanceof ZodError) {
      return ErrorResponse(
        400,
        "Validation failed",
        error?.errors?.map((error) => ({
          path: error.path[0],
          message: error.message,
        }))
      );
    } else if (error instanceof ApiError) {
      return ErrorResponse(error.statusCode, error.message, [
        { path: "", message: error.message },
      ]);
    } else {
      return ErrorResponse(400, undefined, [
        { path: "", message: "Something went wrong" },
      ]);
    }
  }
};

export default catchAsync;
