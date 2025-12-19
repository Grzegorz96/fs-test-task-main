import { Schema, model, Document } from "mongoose";
import { IProductData } from "@/product/domain/entities/product.entity";
import { PRODUCT } from "@/utils/constants";

/**
 * Product document data - plain object for Mongoose operations.
 * Derived from domain IProductData interface.
 */
export type ProductDocumentData = IProductData;

/**
 * Product document interface for Mongoose.
 */
export interface MongoProductDocument extends Document, ProductDocumentData {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Product schema definition.
 */
const mongoProductSchema = new Schema<MongoProductDocument>(
  {
    image: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      enum: PRODUCT.CAPACITY_VALUES,
    },
    dimensions: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    energyClass: {
      type: String,
      required: true,
      enum: PRODUCT.ENERGY_CLASS_VALUES,
    },
    price: {
      value: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
        default: PRODUCT.DEFAULT_CURRENCY,
      },
      installment: {
        value: {
          type: Number,
          required: true,
        },
        period: {
          type: Number,
          required: true,
        },
      },
      validFrom: {
        type: Date,
        required: true,
      },
      validTo: {
        type: Date,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Product model.
 */
export const MongoProductModel = model<MongoProductDocument>(
  PRODUCT.MODEL_NAME,
  mongoProductSchema
);
