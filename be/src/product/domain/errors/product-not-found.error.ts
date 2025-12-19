/**
 * Product not found error - thrown when product with given code doesn't exist.
 */
export class ProductNotFoundError extends Error {
  constructor(code: string) {
    super(`Product with code ${code} not found`);
    this.name = ProductNotFoundError.name;
  }
}
