/**
 * Database configuration constants.
 */
export const DATABASE = {
  DEFAULT_HOST: "localhost",
  DEFAULT_PORT: "27017",
  DEFAULT_DATABASE: "test-task",
  AUTH_SOURCE: "admin",
  URI_PREFIX: "mongodb://",
} as const;
