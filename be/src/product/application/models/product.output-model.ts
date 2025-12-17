import { IProductData } from "@/product/domain/entities/product.entity";

/**
 * Product output model - simple data object for application layer.
 * Derived from domain IProductData interface.
 * Matches frontend IProduct interface.
 */
export type ProductOutputModel = IProductData;
