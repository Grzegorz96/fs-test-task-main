/**
 * Product skeleton loader component
 */
export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl p-6 animate-pulse">
      <div className="flex justify-center mb-4">
        <div className="h-48 w-full bg-gray-200 rounded-2xl" />
      </div>
      <div className="h-6 bg-gray-200 rounded mb-9" />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded mb-3.5" />
      <div className="flex items-center mb-3.5 gap-2">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-6 w-8 bg-gray-200 rounded" />
      </div>
      <div className="h-4 bg-gray-200 rounded mb-3" />
      <div className="mb-3 flex items-center gap-x-1">
        <div className="h-10 w-24 bg-gray-200 rounded" />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-4 w-8 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-5 bg-gray-200 rounded mb-4" />
      <div className="flex justify-center mt-auto">
        <div className="h-10 w-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
};
