import { Router } from "express";
import {
  GetAllProductsUseCase,
  GetProductByCodeUseCase,
  SeedProductsUseCase,
} from "@/product/application/use-cases";
import {
  MongoProductModel,
  MongoProductRepository,
  MongoProductMapper,
} from "@/product/infrastructure/persistance/mongo";
import { ProductRoutes } from "@/product/interface/routes/product.routes";
import { ProductController } from "@/product/interface/controllers/product.controller";
import { ProductOutputMapper } from "@/product/application/mappers/product-output.mapper";
import { LoggerInterface } from "@/logger";
import { ProductDtoMapper } from "@/product/interface/dto/product.dto";

/**
 * Product module - manages product domain initialization.
 * Composes all product-related components following Clean Architecture principles.
 * Uses dependency injection to wire up domain, application, infrastructure, and interface layers.
 */
export class ProductModule {
  private readonly productController: ProductController;
  private readonly productRoutes: ProductRoutes;
  private readonly logger: LoggerInterface;

  constructor(logger: LoggerInterface) {
    this.logger = logger;
    // Initialize mappers - infrastructure and application layer mappers.
    const mongoProductMapper = new MongoProductMapper();
    const productOutputMapper = new ProductOutputMapper();
    const productDtoMapper = new ProductDtoMapper();

    // Initialize repository - MongoDB implementation of domain repository interface.
    const productRepository = new MongoProductRepository(
      MongoProductModel,
      mongoProductMapper
    );

    // Initialize use cases.
    const getAllProductsUseCase = new GetAllProductsUseCase(
      productRepository,
      productOutputMapper
    );
    const getProductByCodeUseCase = new GetProductByCodeUseCase(
      productRepository,
      productOutputMapper
    );
    const seedProductsUseCase = new SeedProductsUseCase(
      productRepository,
      this.logger
    );

    // Initialize controller.
    this.productController = new ProductController(
      getAllProductsUseCase,
      getProductByCodeUseCase,
      seedProductsUseCase,
      productDtoMapper
    );

    // Initialize routes.
    this.productRoutes = new ProductRoutes(this.productController);

    this.logger.info("Product module initialized successfully");
  }

  /**
   * Seeds database with products if empty.
   * @returns Promise that resolves when seeding is complete.
   */
  public async seedIfEmpty(): Promise<void> {
    await this.productController.seedIfEmpty();
  }

  /**
   * Initializes product module and returns router.
   * @returns Express router with product routes.
   */
  public getRouter(): Router {
    return this.productRoutes.getRouter();
  }
}
