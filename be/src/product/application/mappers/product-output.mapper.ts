import { ProductOutputModel } from "@/product/application/models/product.output-model";
import { ProductEntity } from "@/product/domain/entities/product.entity";

/**
 * Product output mapper - converts domain entities to output models.
 */
export class ProductOutputMapper {
  /**
   * Converts domain entity to output model.
   * @param product - Domain entity.
   * @returns Output model.
   */
  public toOutputModel(product: ProductEntity): ProductOutputModel {
    return {
      image: product.image,
      code: product.code,
      name: product.name,
      color: product.color,
      capacity: product.capacity,
      dimensions: product.dimensions,
      features: [...product.features],
      energyClass: product.energyClass,
      price: {
        value: product.price.value,
        currency: product.price.currency,
        installment: {
          value: product.price.installment.value,
          period: product.price.installment.period,
        },
        validFrom: new Date(product.price.validFrom),
        validTo: new Date(product.price.validTo),
      },
    };
  }

  /**
   * Converts array of domain entities to output models.
   * @param products - Array of domain entities.
   * @returns Array of output models.
   */
  public toOutputModels(products: ProductEntity[]): ProductOutputModel[] {
    return products.map((product) => this.toOutputModel(product));
  }
}
