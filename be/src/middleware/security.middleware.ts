import helmet from "helmet";

/**
 * Security middleware configuration using Helmet.
 * Sets various HTTP headers to help secure the application.
 */
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API.
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources.
});
