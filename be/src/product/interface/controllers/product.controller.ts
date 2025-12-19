import { Request, Response, NextFunction } from "express";
import {
  GetAllProductsPort,
  GetProductByCodePort,
  SeedProductsPort,
} from "@/product/application/input-ports";
import { ProductDtoMapper } from "@/product/interface/dto/product.dto";

/**
 * Product controller - handles HTTP requests for products.
 */
export class ProductController {
  constructor(
    private readonly getAllProductsUseCase: GetAllProductsPort,
    private readonly getProductByCodeUseCase: GetProductByCodePort,
    private readonly seedProductsUseCase: SeedProductsPort,
    private readonly productDtoMapper: ProductDtoMapper
  ) {}

  /**
   * Seeds database with products if empty.
   * @returns Promise that resolves when seeding is complete.
   */
  public async seedIfEmpty(): Promise<void> {
    await this.seedProductsUseCase.execute();
  }

  /**
   * Get all products.
   * @param req - Express request.
   * @param res - Express response.
   * @param next - Express next function.
   * @returns Promise that resolves when all products are fetched.
   */
  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await this.getAllProductsUseCase.execute();
      const responseDto = this.productDtoMapper.mapToDtoList(products);
      res.status(responseDto.status).json(responseDto);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by code.
   * @param req - Express request.
   * @param res - Express response.
   * @param next - Express next function.
   * @returns Promise that resolves when product is fetched.
   */
  async getByCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.params;
      const product = await this.getProductByCodeUseCase.execute(code);
      const responseDto = this.productDtoMapper.mapToDto(product);
      res.status(responseDto.status).json(responseDto);
    } catch (error) {
      next(error);
    }
  }
}
