import Skeleton from "@mui/material/Skeleton";

const ProductCardSkeleton = () => {
  return (
    <div>
      <Skeleton
        variant="rounded"
        animation="wave"
        className="w-full! h-50! rounded-lg! dark:bg-gray-800/50!"
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        className="h-3! mt-4! dark:bg-gray-800/50!"
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        className="h-3! mt-4! w-40! dark:bg-gray-800/50!"
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        className="h-3! mt-4! w-40! dark:bg-gray-800/50!"
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        className="h-3! mt-4! w-40! dark:bg-gray-800/50!"
      />
    </div>
  );
};

export default ProductCardSkeleton;
