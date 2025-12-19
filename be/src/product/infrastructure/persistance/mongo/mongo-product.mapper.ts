import { ProductEntity } from "@/product/domain/entities/product.entity";
import {
  MongoProductDocument,
  ProductDocumentData,
} from "@/product/infrastructure/persistance/mongo/mongo-product.model";

/**
 * MongoDB product mapper - converts between MongoDB documents and domain entities.
 * Implements deep copying to ensure immutability and prevent reference sharing between layers.
 */
export class MongoProductMapper {
  /**
   * Converts MongoDB document to domain entity.
   * Creates deep copies of nested objects and arrays to ensure immutability.
   * @param document - MongoDB document.
   * @returns Domain entity with independent data copies.
   */
  public toEntity(document: MongoProductDocument): ProductEntity {
    return new ProductEntity({
      id: document._id.toString(),
      image: document.image,
      code: document.code,
      name: document.name,
      color: document.color,
      capacity: document.capacity,
      dimensions: document.dimensions,
      // Deep copy array to prevent reference sharing.
      features: [...document.features],
      energyClass: document.energyClass,
      // Deep copy price object with new Date instances to ensure immutability.
      price: {
        value: document.price.value,
        currency: document.price.currency,
        installment: {
          value: document.price.installment.value,
          period: document.price.installment.period,
        },
        // Create new Date instances to prevent reference sharing.
        validFrom: new Date(document.price.validFrom),
        validTo: new Date(document.price.validTo),
      },
      // Create new Date instances if present.
      createdAt: document.createdAt ? new Date(document.createdAt) : undefined,
      updatedAt: document.updatedAt ? new Date(document.updatedAt) : undefined,
    });
  }

  /**
   * Converts array of MongoDB documents to domain entities.
   * @param documents - Array of MongoDB documents.
   * @returns Array of domain entities.
   */
  public toEntities(documents: MongoProductDocument[]): ProductEntity[] {
    return documents.map((document) => this.toEntity(document));
  }

  /**
   * Converts domain entity to plain object for MongoDB operations.
   * Creates deep copies of nested objects and arrays to ensure immutability.
   * @param product - Domain entity.
   * @returns Plain object for MongoDB with independent data copies.
   */
  public toDocumentData(product: ProductEntity): ProductDocumentData {
    return {
      image: product.image,
      code: product.code,
      name: product.name,
      color: product.color,
      capacity: product.capacity,
      dimensions: product.dimensions,
      // Deep copy array to prevent reference sharing.
      features: [...product.features],
      energyClass: product.energyClass,
      // Deep copy price object with new Date instances to ensure immutability.
      price: {
        value: product.price.value,
        currency: product.price.currency,
        installment: {
          value: product.price.installment.value,
          period: product.price.installment.period,
        },
        // Create new Date instances to prevent reference sharing.
        validFrom: new Date(product.price.validFrom),
        validTo: new Date(product.price.validTo),
      },
    };
  }
}
