import { useEffect, useState } from 'react';
import { IProduct } from '../interfaces/product';
import { productService } from '../services/productService';

interface UseProductsResult {
  products: IProduct[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching products from API
 * @returns Object with products, loading state, error and refetch function
 */
export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch products');
      setError(error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};
