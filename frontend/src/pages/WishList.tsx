import Skeleton from "@mui/material/Skeleton";
import { useGetWishlistQuery } from "../app/services/user";
import Navbar from "../components/Navbar";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import ProductCard from "../components/ProductCard";

type Image = {
  url: string;
};

type Product = {
  id: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  saved: boolean;
  images: Image[];
};
type Data = {
  success: boolean;
  products: Product[];
};

const WishList = () => {
  const { data, isLoading }: { data: Data; isLoading: boolean } =
    useGetWishlistQuery(null);
  return (
    <div className="w-screen min-h-screen dark:bg-gray-800">
      <Navbar />
      <div className="pt-10 px-5 md:px-[5%] lg:px-[10%]">
        <h1 className="text-3xl text-slate-700 dark:text-gray-300 font-medium mb-2">
          Your Wishlist
        </h1>
        {isLoading ? (
          <Skeleton variant="rounded" className="h-2! w-40!" />
        ) : data && data.success && data.products.length === 0 ? (
          <p className="text-slate-600">You haven't save a product yet!</p>
        ) : (
          <p className="text-slate-600">
            You saved{" "}
            <span className="text-primary font-medium text-[18px]">
              {data.products.length}
            </span>{" "}
            product {data.products.length > 1 && "s"}
          </p>
        )}
        <div className="pt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 md:gap-x-6 gap-y-5">
          {isLoading &&
            new Array(5)
              .fill(0)
              .map((_, index: number) => <ProductCardSkeleton key={index} />)}
          {data &&
            data.success &&
            data.products.map((product: Product) => {
              return (
                <ProductCard
                  key={product.id}
                  {...{ ...product, saved: true }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default WishList;
