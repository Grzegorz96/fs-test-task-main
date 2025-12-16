import {
  ProductRepositoryPort,
  GetAllProductsPort,
} from "@/product/application/ports";
import { ProductOutputModel } from "@/product/application/models/product.output-model";
import { ProductOutputMapper } from "@/product/application/mappers/product-output.mapper";

/**
 * Use case for getting all products.
 */
export class GetAllProductsUseCase implements GetAllProductsPort {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly productOutputMapper: ProductOutputMapper
  ) {}

  /**
   * Execute use case - get all products.
   * @returns Promise with array of product output models.
   */
  async execute(): Promise<ProductOutputModel[]> {
    const products = await this.productRepository.findAll();
    return this.productOutputMapper.toOutputModels(products);
  }
}
