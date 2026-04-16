import { getErrorPresentation } from "./get-error-presentation";
import { type NormalizeApiErrorOptions, normalizeApiError } from "./normalize-api-error";

export const getErrorMessage = async (error: unknown, options: NormalizeApiErrorOptions = {}) => {
  const normalizedError = await normalizeApiError(error, options);
  return getErrorPresentation(normalizedError).message;
};
