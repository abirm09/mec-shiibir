type TErrorMessage = { path: string | number; message: string };

type TErrorResponse = {
  success: false;
  message: string;
  errorMessages?: TErrorMessage[];
};

type TMeta = { page: number; limit: number; total: number };

type TSuccessResponse = {
  success: true;
  message: string;
  data?: Record<string, unknown>;
  meta?: TMeta;
};

export type { TErrorMessage, TErrorResponse, TMeta, TSuccessResponse };
