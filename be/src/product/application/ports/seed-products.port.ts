/**
 * Seed products use case port - input port.
 * Defines contract for seeding products.
 */
export interface SeedProductsPort {
  /**
   * Execute use case - seed products if database is empty.
   * @returns Promise that resolves when seeding is complete.
   */
  execute(): Promise<void>;
}
