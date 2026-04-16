import { AppError } from "./app-error";

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};
