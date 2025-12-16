import { AppModule } from "@/app.module";
import { SERVER } from "@/utils/constants";

/**
 * Bootstrap function - creates application, initializes middleware, routes and starts server
 */
async function bootstrap(): Promise<void> {
  try {
    // Create application module.
    const appModule = new AppModule();

    // Initialize database connection and seed if empty.
    await appModule.connectToDatabase();

    // Initialize middleware (must be before routes).
    appModule.initializeMiddlewares();

    // Initialize routes (after middleware).
    appModule.initializeRoutes();

    // Initialize error handling (must be after routes).
    appModule.initializeErrorHandling();

    // Start server.
    appModule.start();
  } catch (error) {
    // Fallback to console if logger is not available during bootstrap.
    console.error("Failed to start server:", error);
    process.exit(SERVER.EXIT_CODE_ERROR);
  }
}

void bootstrap();
