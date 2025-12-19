import { ProductEntity } from "@/product/domain/entities/product.entity";

/**
 * Product repository port - output port for product data access.
 * Defines contract for product repository implementations.
 */
export interface ProductRepository {
  /**
   * Find all products.
   * @returns Promise with array of products.
   */
  findAll(): Promise<ProductEntity[]>;

  /**
   * Find product by code.
   * @param code - Product code.
   * @returns Promise with product or null if not found.
   */
  findByCode(code: string): Promise<ProductEntity | null>;

  /**
   * Create new product.
   * @param product - Product entity.
   * @returns Promise with created product.
   */
  create(product: ProductEntity): Promise<ProductEntity>;
}
