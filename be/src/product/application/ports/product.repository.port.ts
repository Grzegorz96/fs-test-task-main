import { Product } from "@/product/domain/entities/product.entity";

/**
 * Product repository port - output port for product data access.
 * Defines contract for product repository implementations.
 */
export interface ProductRepositoryPort {
  /**
   * Find all products.
   * @returns Promise with array of products.
   */
  findAll(): Promise<Product[]>;

  /**
   * Find product by code.
   * @param code - Product code.
   * @returns Promise with product or null if not found.
   */
  findByCode(code: string): Promise<Product | null>;

  /**
   * Create new product.
   * @param product - Product entity.
   * @returns Promise with created product.
   */
  create(product: Product): Promise<Product>;
}
