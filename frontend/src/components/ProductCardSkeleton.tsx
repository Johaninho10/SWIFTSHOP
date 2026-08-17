import Skeleton from "@mui/material/Skeleton";

const ProductCardSkeleton = () => {
  return (
    <div>
      <Skeleton variant="rounded" animation="wave" className="w-full! h-50! rounded-lg!" />
      <Skeleton variant="rounded" animation="wave" className="h-3! mt-4!" />
      <Skeleton variant="rounded" animation="wave" className="h-3! mt-4! w-40!" />
      <Skeleton variant="rounded" animation="wave" className="h-3! mt-4! w-40!" />
      <Skeleton variant="rounded" animation="wave" className="h-3! mt-4! w-40!" />
      <Skeleton variant="rounded" animation="wave" className="h-8! mt-4! w-full!" />
    </div>
  );
};

export default ProductCardSkeleton;
