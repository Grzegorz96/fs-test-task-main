import { IProduct, Capacity, EnergyClass, Features } from '../interfaces/product';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * API response wrapper
 */
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Product data from API
 */
interface ProductApiResponse {
  image: string;
  code: string;
  name: string;
  color: string;
  capacity: number;
  dimensions: string;
  features: string[];
  energyClass: string;
  price: {
    value: number;
    currency: string;
    installment: {
      value: number;
      period: number;
    };
    validFrom: string;
    validTo: string;
  };
}

/**
 * Product service - handles API calls for products
 */
export class ProductService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetches all products from the API
   * @returns Promise with array of products
   * @throws Error if request fails
   */
  public async getAllProducts(): Promise<IProduct[]> {
    try {
      // Simulate network delay for testing skeleton loaders
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(`${this.baseUrl}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      const apiResponse: ApiResponse<ProductApiResponse[]> = await response.json();
      if (apiResponse.status !== 200) {
        throw new Error(apiResponse.message || 'Failed to fetch products');
      }
      return this.mapApiResponseToProducts(apiResponse.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Maps API response to IProduct format
   * @param apiProducts - Products from API response data
   * @returns Array of IProduct
   */
  private mapApiResponseToProducts(apiProducts: ProductApiResponse[]): IProduct[] {
    return apiProducts.map(
      (product): IProduct => ({
        image: product.image,
        code: product.code,
        name: product.name,
        color: product.color,
        capacity: product.capacity as Capacity,
        dimensions: product.dimensions,
        features: product.features as Features[],
        energyClass: product.energyClass as EnergyClass,
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
      })
    );
  }
}

export const productService = new ProductService();
