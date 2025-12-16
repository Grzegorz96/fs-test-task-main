import mongoose, { ConnectOptions } from "mongoose";
import { z } from "zod";
import { LoggerInterface } from "@/logger";
import { DATABASE } from "@/utils/constants";

/**
 * MongoDB environment variables schema.
 */
const mongoEnvSchema = z.object({
  MONGODB_HOST: z.string().min(1).default(DATABASE.DEFAULT_HOST),
  MONGODB_PORT: z.string().regex(/^\d+$/).default(DATABASE.DEFAULT_PORT),
  MONGODB_DATABASE: z.string().min(1).default(DATABASE.DEFAULT_DATABASE),
  MONGODB_USERNAME: z.string().min(1),
  MONGODB_PASSWORD: z.string().min(1),
});

type MongoEnv = z.infer<typeof mongoEnvSchema>;

/**
 * Database configuration and connection manager.
 */
export class DatabaseConfig {
  private readonly mongoEnv: MongoEnv;

  constructor(private readonly logger: LoggerInterface) {
    this.mongoEnv = this.validateMongoEnv();
  }

  /**
   * Validates and parses MongoDB environment variables.
   * @returns Validated MongoDB environment variables
   * @throws Error if validation fails.
   */
  private validateMongoEnv(): MongoEnv {
    const result = mongoEnvSchema.safeParse({
      MONGODB_HOST: process.env.MONGODB_HOST,
      MONGODB_PORT: process.env.MONGODB_PORT,
      MONGODB_DATABASE: process.env.MONGODB_DATABASE,
      MONGODB_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
      MONGODB_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD,
    });

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new Error(
        `MongoDB environment validation failed: ${errorMessages}`
      );
    }

    return result.data;
  }

  /**
   * Builds MongoDB connection URI without credentials.
   * @param host - MongoDB host.
   * @param port - MongoDB port.
   * @param database - Database name.
   * @returns MongoDB connection string.
   */
  private buildMongoUri(host: string, port: string, database: string): string {
    return `${DATABASE.URI_PREFIX}${host}:${port}/${database}`;
  }

  /**
   * Connects to MongoDB database.
   * @param uri - MongoDB connection string (optional, will be built from env vars if not provided).
   * @returns Promise that resolves when connection is established.
   */
  public async connect(uri?: string): Promise<void> {
    try {
      const connectionUri =
        uri ||
        this.buildMongoUri(
          this.mongoEnv.MONGODB_HOST,
          this.mongoEnv.MONGODB_PORT,
          this.mongoEnv.MONGODB_DATABASE
        );

      const options: ConnectOptions = {
        user: this.mongoEnv.MONGODB_USERNAME,
        pass: this.mongoEnv.MONGODB_PASSWORD,
        authSource: DATABASE.AUTH_SOURCE,
      };

      await mongoose.connect(connectionUri, options);
      this.logger.info("Connected to MongoDB", {
        host: this.mongoEnv.MONGODB_HOST,
        port: this.mongoEnv.MONGODB_PORT,
        database: this.mongoEnv.MONGODB_DATABASE,
      });
    } catch (error) {
      this.logger.error("MongoDB connection error", error, {
        host: this.mongoEnv.MONGODB_HOST,
        port: this.mongoEnv.MONGODB_PORT,
        database: this.mongoEnv.MONGODB_DATABASE,
      });
      throw error;
    }
  }

  /**
   * Disconnects from MongoDB database.
   * @returns Promise that resolves when disconnection is complete.
   */
  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.logger.info("Disconnected from MongoDB");
    } catch (error) {
      this.logger.error("MongoDB disconnection error", error);
      throw error;
    }
  }
}
