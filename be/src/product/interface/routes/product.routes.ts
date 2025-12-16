import { Router } from "express";
import { ProductController } from "@/product/interface/controllers/product.controller";

/**
 * Product routes - manages Express routes for product endpoints.
 */
export class ProductRoutes {
  private readonly router: Router;

  constructor(private readonly productController: ProductController) {
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Initializes all product routes.
   */
  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.productController.getAll.bind(this.productController)
    );
    this.router.get(
      "/:code",
      this.productController.getByCode.bind(this.productController)
    );
  }

  /**
   * Gets Express router with product routes.
   * @returns Express router with product routes.
   */
  public getRouter(): Router {
    return this.router;
  }
}
