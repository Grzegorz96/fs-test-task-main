import { ProductCard } from '../cards/Product';
import { Button } from '../button';
import { useFilterContext } from '../../contexts/filters';
import { useProducts } from '../../hooks/useProducts';
import { ProductSkeleton } from './ProductSkeleton';
import { ChevronDown } from 'react-feather';

export const Products = () => {
  const { filters, query } = useFilterContext();
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 mx-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-8 mx-4">
        <p className="text-center text-red-500 text-xl mb-4">
          Wystąpił błąd podczas ładowania produktów
        </p>
        <p className="text-center text-gray-500 text-sm mb-4">{error.message}</p>
        <Button
          variant="primary"
          value="Spróbuj ponownie"
          onClick={() => window.location.reload()}
        />
      </div>
    );
  }

  const searchByCode = products.filter((product) => {
    return product.code.toLowerCase().includes(query.toLowerCase());
  });

  const filteredProducts = searchByCode.filter((product) => {
    if (filters.capacity && product.capacity !== filters.capacity) {
      return false;
    }
    if (filters.energyClass && product.energyClass !== filters.energyClass) {
      return false;
    }
    return !(filters.feature && !product.features.includes(filters.feature));
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (filters.sort === 'price') {
      return a.price.value - b.price.value;
    }
    if (filters.sort === 'capacity') {
      return a.capacity - b.capacity;
    }
    return 0;
  });

  if (filteredProducts.length === 0) {
    return (
      <div>
        <p className="text-center text-gray-500 text-xl mt-4">
          Brak produktów spełniających kryteria wyszukiwania
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 mx-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.code} {...product} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Button
          variant={'tertiary'}
          value={'Pokaż więcej'}
          icon={<ChevronDown />}
          onClick={() => console.log('some action')}
        />
      </div>
    </>
  );
};
