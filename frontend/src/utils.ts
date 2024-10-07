import { APiError } from "./types/ApiError";

export const getError = (error: APiError) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
