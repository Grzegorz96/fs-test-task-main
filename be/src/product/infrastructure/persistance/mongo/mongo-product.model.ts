import { Schema, model, HydratedDocument } from "mongoose";
import { PRODUCT } from "@/utils/constants";
import { IProductData } from "@/product/domain/entities/product.entity";

/**
 * ProductSchemaType - schema type for the Product schema.
 */
export type ProductSchemaType = IProductData;

/**
 * MongoTimestamps - timestamps interface for the Product schema.
 */
export interface MongoTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * MongoProductDocument - hydrated document type for the Product schema.
 */
export type MongoProductDocument = HydratedDocument<
  ProductSchemaType & MongoTimestamps
>;

const MongoProductSchema = new Schema<MongoProductDocument>(
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
 * MongoProductModel - model for the Product schema.
 */
export const MongoProductModel = model<MongoProductDocument>(
  PRODUCT.MODEL_NAME,
  MongoProductSchema
);
