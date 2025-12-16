import { ProductOutputModel } from "@/product/application/models/product.output-model";

/**
 * Get all products use case port - input port.
 * Defines contract for getting all products.
 */
export interface GetAllProductsPort {
  /**
   * Execute use case - get all products.
   * @returns Promise with array of product output models.
   */
  execute(): Promise<ProductOutputModel[]>;
}
