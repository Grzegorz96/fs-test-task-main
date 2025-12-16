import { Product } from "@/product/domain/entities/product.entity";
import {
  ProductDocument,
  ProductDocumentData,
} from "@/product/infrastructure/mongo/models/product.model";

/**
 * Product document mapper - converts Mongoose documents to domain entities.
 */
export class ProductDocumentMapper {
  /**
   * Converts Mongoose document to domain entity.
   * @param document - Mongoose document.
   * @returns Domain entity.
   */
  public toEntity(document: ProductDocument): Product {
    return new Product({
      id: document._id.toString(),
      image: document.image,
      code: document.code,
      name: document.name,
      color: document.color,
      capacity: document.capacity,
      dimensions: document.dimensions,
      features: document.features,
      energyClass: document.energyClass,
      price: document.price,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  /**
   * Converts array of Mongoose documents to domain entities.
   * @param documents - Array of Mongoose documents.
   * @returns Array of domain entities.
   */
  public toEntities(documents: ProductDocument[]): Product[] {
    return documents.map((document) => this.toEntity(document));
  }

  /**
   * Converts domain entity to plain object for Mongoose operations.
   * @param product - Domain entity.
   * @returns Plain object for Mongoose.
   */
  public toDocumentData(product: Product): ProductDocumentData {
    return {
      image: product.image,
      code: product.code,
      name: product.name,
      color: product.color,
      capacity: product.capacity,
      dimensions: product.dimensions,
      features: product.features,
      energyClass: product.energyClass,
      price: product.price,
    };
  }
}
