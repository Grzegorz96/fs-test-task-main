import {
  ProductRepositoryPort,
  SeedProductsPort,
} from "@/product/application/ports";
import { Product } from "@/product/domain/entities/product.entity";
import { seedProducts } from "@/product/application/data/seed-products";
import { LoggerInterface } from "@/logger";

/**
 * Use case for seeding products in database.
 */
export class SeedProductsUseCase implements SeedProductsPort {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly logger: LoggerInterface
  ) {}

  /**
   * Checks if database has any products.
   * @returns Promise with boolean indicating if products exist.
   */
  private async hasProducts(): Promise<boolean> {
    const products = await this.productRepository.findAll();
    return products.length > 0;
  }

  /**
   * Seeds database with mock products if database is empty.
   * @returns Promise that resolves when seeding is complete.
   */
  public async execute(): Promise<void> {
    try {
      const hasExistingProducts = await this.hasProducts();
      if (hasExistingProducts) {
        this.logger.info("Database already contains products, skipping seed");
        return;
      }
      this.logger.info("Database is empty, seeding with mock data...");
      for (const productData of seedProducts) {
        const product = new Product(productData);
        await this.productRepository.create(product);
      }
      this.logger.info(`Successfully seeded ${seedProducts.length} products`, {
        count: seedProducts.length,
      });
    } catch (error) {
      this.logger.error("Error seeding database", error);
      throw error;
    }
  }
}
