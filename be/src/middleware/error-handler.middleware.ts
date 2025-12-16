import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import { LoggerInterface } from "@/logger";
import { HTTP_STATUS, HTTP_MESSAGES } from "@/utils/constants";
import { createErrorResponse } from "@/utils/response-helpers";

/**
 * Creates error handler middleware with logger.
 * @param logger - Logger instance.
 * @returns Express error handler middleware function.
 */
export function createErrorHandlerMiddleware(
  logger: LoggerInterface
): ErrorRequestHandler {
  return (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    // Check if response has already been sent.
    if (res.headersSent) {
      logger.error("Response already sent, cannot send error response", err, {
        method: req.method,
        url: req.url,
        ip: req.ip,
      });
      return;
    }
    let status: number;
    let message: string;
    // Check if error has custom status property (domain errors).
    if ("status" in err && typeof err.status === "number") {
      status = err.status;
      message = err.message || HTTP_MESSAGES.INTERNAL_SERVER_ERROR;
    } else if (err instanceof MongooseError.ValidationError) {
      // Mongoose validation error - return generic message, log details.
      status = HTTP_STATUS.BAD_REQUEST;
      message = HTTP_MESSAGES.VALIDATION_ERROR;
      logger.warn("Validation error occurred", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        error: {
          name: err.name,
          message: err.message,
          errors: err.errors,
        },
      });
    } else if (err instanceof MongooseError.CastError) {
      // Mongoose cast error - return generic message, log details.
      status = HTTP_STATUS.BAD_REQUEST;
      message = HTTP_MESSAGES.INVALID_DATA_FORMAT;
      logger.warn("Cast error occurred", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        error: {
          name: err.name,
          message: err.message,
          kind: err.kind,
          value: err.value,
        },
      });
    } else if (err.name === "MongoServerError" && (err as any).code === 11000) {
      // MongoDB duplicate key error - return generic message, log details.
      status = HTTP_STATUS.BAD_REQUEST;
      message = HTTP_MESSAGES.DUPLICATE_RECORD;
      logger.warn("Duplicate key error occurred", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        error: {
          name: err.name,
          message: err.message,
          code: (err as any).code,
          keyPattern: (err as any).keyPattern,
        },
      });
    } else if (err instanceof SyntaxError && "body" in err) {
      // JSON parsing error - return generic message.
      status = HTTP_STATUS.BAD_REQUEST;
      message = HTTP_MESSAGES.INVALID_JSON;
      logger.warn("JSON parsing error occurred", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        error: {
          name: err.name,
          message: err.message,
        },
      });
    } else {
      // Default to internal server error - never expose internal error details.
      status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      message = HTTP_MESSAGES.INTERNAL_SERVER_ERROR;
      logger.error("Internal server error occurred", err, {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });
    }

    const response = createErrorResponse(status, message);
    res.status(status).json(response);
  };
}
