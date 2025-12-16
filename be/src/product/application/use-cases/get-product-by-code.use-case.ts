import {
  ProductRepositoryPort,
  GetProductByCodePort,
} from "@/product/application/ports";
import { ProductOutputModel } from "@/product/application/models/product.output-model";
import { ProductOutputMapper } from "@/product/application/mappers/product-output.mapper";
import { ProductNotFoundError } from "@/product/application/errors/product-not-found.error";

/**
 * Use case for getting product by code.
 */
export class GetProductByCodeUseCase implements GetProductByCodePort {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly productOutputMapper: ProductOutputMapper
  ) {}

  /**
   * Execute use case - get product by code.
   * @param code - Product code.
   * @returns Promise with product output model.
   * @throws ProductNotFoundError if product with given code doesn't exist.
   */
  async execute(code: string): Promise<ProductOutputModel> {
    const product = await this.productRepository.findByCode(code);
    if (!product) {
      throw new ProductNotFoundError(code);
    }
    return this.productOutputMapper.toOutputModel(product);
  }
}
