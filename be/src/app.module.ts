import express, { Express, Request, Response } from "express";
import cors from "cors";
import { DatabaseModule } from "@/database/database.module";
import { ProductModule } from "@/product/product.module";
import {
  createErrorHandlerMiddleware,
  notFoundMiddleware,
  apiRateLimiter,
  apiThrottler,
  securityMiddleware,
} from "@/middleware";
import { Logger, LoggerInterface } from "@/logger";
import {
  HTTP_STATUS,
  HTTP_MESSAGES,
  ROUTES,
  SERVER,
  CORS,
} from "@/utils/constants";

/**
 * Application module - configures Express application, connects to database and routes.
 */
export class AppModule {
  private readonly app: Express;
  private readonly logger: LoggerInterface;
  private readonly databaseModule: DatabaseModule;
  private readonly productModule: ProductModule;

  /**
   * Creates application module.
   * @returns Application module.
   */
  constructor() {
    this.app = express();
    this.logger = new Logger();
    this.databaseModule = new DatabaseModule(this.logger);
    this.productModule = new ProductModule(this.logger);
    this.logger.info("Application module initialized successfully");
  }

  /**
   * Initializes connection to database and seeds if empty.
   */
  public async connectToDatabase(): Promise<void> {
    await this.databaseModule.connect();
    await this.productModule.seedIfEmpty();
  }

  /**
   * Initializes Express middleware.
   */
  public initializeMiddlewares(): void {
    // Security headers (Helmet).
    this.app.use(securityMiddleware);

    // CORS configuration.
    this.app.use(
      cors({
        origin: CORS.ALL_ORIGINS,
        methods: CORS.METHODS,
        allowedHeaders: CORS.ALLOWED_HEADERS,
      })
    );

    // JSON body parser.
    this.app.use(express.json());

    // Rate limiting - applies to all routes.
    this.app.use(apiRateLimiter);

    // Throttling - slows down requests after threshold.
    this.app.use(apiThrottler);
  }

  /**
   * Initializes application routes.
   */
  public initializeRoutes(): void {
    this.app.get(ROUTES.HEALTH, (_req: Request, res: Response): void => {
      res.status(HTTP_STATUS.OK).json({ status: HTTP_MESSAGES.OK });
    });
    this.app.use(ROUTES.API_PRODUCTS, this.productModule.getRouter());
  }

  /**
   * Initializes error handling middleware.
   */
  public initializeErrorHandling(): void {
    // Not found middleware - handles 404 for unmatched routes.
    this.app.use(notFoundMiddleware);
    // Error handler middleware - handles all errors (must be last).
    this.app.use(createErrorHandlerMiddleware(this.logger));
  }

  /**
   * Starts the application server.
   * @param port - Port number (optional, defaults to 3000 or from env).
   */
  public start(port?: number): void {
    const serverPort = port || Number(process.env.PORT) || SERVER.DEFAULT_PORT;

    this.app.listen(serverPort, () => {
      this.logger.info(`Server running on http://localhost:${serverPort}`, {
        port: serverPort,
      });
    });
  }
}
