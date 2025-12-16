import { ProductOutputModel } from "@/product/application/models/product.output-model";

/**
 * Get product by code use case port - input port.
 * Defines contract for getting product by code.
 */
export interface GetProductByCodePort {
  /**
   * Execute use case - get product by code.
   * @param code - Product code.
   * @returns Promise with product output model.
   * @throws ProductNotFoundError if product with given code doesn't exist.
   */
  execute(code: string): Promise<ProductOutputModel>;
}
