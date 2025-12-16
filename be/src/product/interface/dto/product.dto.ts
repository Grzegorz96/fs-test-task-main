import { ProductOutputModel } from "@/product/application/models/product.output-model";
import { HTTP_STATUS, HTTP_MESSAGES } from "@/utils/constants";

/**
 * Product data DTO - product information.
 */
export interface ProductDataDto {
  image: string;
  code: string;
  name: string;
  color: string;
  capacity: number;
  dimensions: string;
  features: string[];
  energyClass: string;
  price: {
    value: number;
    currency: string;
    installment: {
      value: number;
      period: number;
    };
    validFrom: string;
    validTo: string;
  };
}

/**
 * API response wrapper.
 */
export interface ApiResponseDto<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Product response DTO - full API response structure.
 */
export type ProductResponseDto = ApiResponseDto<ProductDataDto>;

/**
 * Products list response DTO - full API response structure.
 */
export type ProductsListResponseDto = ApiResponseDto<ProductDataDto[]>;

/**
 * Product DTO mapper - maps Product output models to DTOs and forms final API response.
 */
export class ProductDtoMapper {
  /**
   * Maps Product output model to ProductDataDto.
   * @param product - Product output model.
   * @returns ProductDataDto.
   */
  private mapToProductDataDto(product: ProductOutputModel): ProductDataDto {
    return {
      image: product.image,
      code: product.code,
      name: product.name,
      color: product.color,
      capacity: product.capacity,
      dimensions: product.dimensions,
      features: product.features,
      energyClass: product.energyClass,
      price: {
        value: product.price.value,
        currency: product.price.currency,
        installment: {
          value: product.price.installment.value,
          period: product.price.installment.period,
        },
        validFrom: product.price.validFrom.toISOString(),
        validTo: product.price.validTo.toISOString(),
      },
    };
  }

  /**
   * Maps Product output model to full API response DTO.
   * @param product - Product output model.
   * @param status - HTTP status code.
   * @param message - Response message.
   * @returns ProductResponseDto.
   */
  public mapToDto(
    product: ProductOutputModel,
    status: number = 200,
    message: string = HTTP_MESSAGES.PRODUCT_RETRIEVED_SUCCESSFULLY
  ): ProductResponseDto {
    return {
      status,
      message,
      data: this.mapToProductDataDto(product),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Maps array of Product output models to full API response DTO.
   * @param products - Array of product output models.
   * @param status - HTTP status code.
   * @param message - Response message.
   * @returns ProductsListResponseDto.
   */
  public mapToDtoList(
    products: ProductOutputModel[],
    status: number = HTTP_STATUS.OK,
    message: string = HTTP_MESSAGES.PRODUCTS_RETRIEVED_SUCCESSFULLY
  ): ProductsListResponseDto {
    return {
      status,
      message,
      data: products.map((product) => this.mapToProductDataDto(product)),
      timestamp: new Date().toISOString(),
    };
  }
}
