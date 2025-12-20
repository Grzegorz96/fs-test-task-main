import { Model } from "mongoose";
import { ProductRepository } from "@/product/domain/repositories/product.repository";
import { ProductEntity } from "@/product/domain/entities/product.entity";
import {
  MongoProductDocument,
  MongoProductMapper,
} from "@/product/infrastructure/persistance/mongo";

/**
 * MongoDB implementation of product repository.
 */
export class MongoProductRepository implements ProductRepository {
  constructor(
    private readonly productModel: Model<MongoProductDocument>,
    private readonly mongoProductMapper: MongoProductMapper
  ) {}

  /**
   * Find all products.
   * @returns Promise with array of products entities.
   */
  async findAll(): Promise<ProductEntity[]> {
    const documents = await this.productModel.find();
    return this.mongoProductMapper.toDomainEntities(documents);
  }

  /**
   * Find product by code.
   * @param code - Product code.
   * @returns Promise with product entity or null if not found.
   */
  async findByCode(code: string): Promise<ProductEntity | null> {
    const document = await this.productModel.findOne({ code });
    return document ? this.mongoProductMapper.toDomainEntity(document) : null;
  }

  /**
   * Create new product.
   * @param product - Product entity.
   * @returns Promise with created product entity.
   */
  async create(product: ProductEntity): Promise<ProductEntity> {
    const documentSchemaData =
      this.mongoProductMapper.toDocumentSchema(product);
    const document = new this.productModel(documentSchemaData);
    const saved = await document.save();
    return this.mongoProductMapper.toDomainEntity(saved);
  }
}
