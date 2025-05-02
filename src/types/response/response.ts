type TErrorMessage = { path: string | number; message: string };

type TErrorResponse = {
  success: false;
  message: string;
  errorMessages?: TErrorMessage[];
};

type TSuccessResponse = {
  success: true;
  message: string;
  data?: Record<string, unknown>;
};

export type { TErrorMessage, TErrorResponse, TSuccessResponse };
