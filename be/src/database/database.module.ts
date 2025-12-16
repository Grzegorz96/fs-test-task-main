import { DatabaseConfig } from "./database.config";
import { LoggerInterface } from "@/logger";

/**
 * Database module - manages database connection.
 */
export class DatabaseModule {
  private readonly databaseConfig: DatabaseConfig;
  private readonly logger: LoggerInterface;

  constructor(logger: LoggerInterface) {
    this.logger = logger;
    this.databaseConfig = new DatabaseConfig(this.logger);
    this.logger.info("Database module initialized successfully");
  }

  /**
   * Connects to database.
   * @returns Promise that resolves when connection is established.
   */
  public async connect(): Promise<void> {
    await this.databaseConfig.connect();
  }

  /**
   * Disconnects from database.
   * @returns Promise that resolves when disconnection is complete.
   */
  public async disconnect(): Promise<void> {
    await this.databaseConfig.disconnect();
  }
}
