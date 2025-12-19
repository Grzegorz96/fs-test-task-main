/**
 * HTTP status codes constants.
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * HTTP status messages constants.
 */
export const HTTP_MESSAGES = {
  OK: "ok",
  PRODUCT_RETRIEVED_SUCCESSFULLY: "Product retrieved successfully",
  PRODUCTS_RETRIEVED_SUCCESSFULLY: "Products retrieved successfully",
  ROUTE_NOT_FOUND: "Route not found",
  VALIDATION_ERROR: "Validation error",
  INVALID_DATA_FORMAT: "Invalid data format",
  DUPLICATE_RECORD: "Record already exists",
  INVALID_JSON: "Invalid JSON format",
  INTERNAL_SERVER_ERROR: "Internal server error",
  TOO_MANY_REQUESTS: "Too many requests from this IP, please try again later",
} as const;
