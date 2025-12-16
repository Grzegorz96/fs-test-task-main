import { Model } from "mongoose";
import { ProductRepositoryPort } from "@/product/application/ports";
import { Product } from "@/product/domain/entities/product.entity";
import { ProductDocument } from "@/product/infrastructure/mongo/models/product.model";
import { ProductDocumentMapper } from "@/product/infrastructure/mongo/mappers/product-document.mapper";

/**
 * MongoDB implementation of product repository.
 */
export class ProductRepository implements ProductRepositoryPort {
  constructor(
    private readonly productModel: Model<ProductDocument>,
    private readonly productDocumentMapper: ProductDocumentMapper
  ) {}

  /**
   * Find all products.
   * @returns Promise with array of products entities.
   */
  async findAll(): Promise<Product[]> {
    const documents = await this.productModel.find();
    return this.productDocumentMapper.toEntities(documents);
  }

  /**
   * Find product by code.
   * @param code - Product code.
   * @returns Promise with product entity or null if not found.
   */
  async findByCode(code: string): Promise<Product | null> {
    const document = await this.productModel.findOne({ code });
    return document ? this.productDocumentMapper.toEntity(document) : null;
  }

  /**
   * Create new product.
   * @param product - Product entity.
   * @returns Promise with created product entity.
   */
  async create(product: Product): Promise<Product> {
    const documentData = this.productDocumentMapper.toDocumentData(product);
    const document = new this.productModel(documentData);
    const saved = await document.save();
    return this.productDocumentMapper.toEntity(saved);
  }
}
