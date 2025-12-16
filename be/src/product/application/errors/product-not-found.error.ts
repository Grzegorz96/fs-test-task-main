import { HTTP_STATUS, HTTP_MESSAGES } from "@/utils/constants";

/**
 * Product not found error - thrown when product with given code doesn't exist.
 */
export class ProductNotFoundError extends Error {
  public readonly status: number;

  constructor(code: string) {
    super(`${HTTP_MESSAGES.PRODUCT_NOT_FOUND}: ${code}`);
    this.name = ProductNotFoundError.name;
    this.status = HTTP_STATUS.NOT_FOUND;
  }
}
