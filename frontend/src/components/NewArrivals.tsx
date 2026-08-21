import { useGetNewArrivalsQuery } from "../app/services/products";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

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

const NewArrivals = () => {
  const { data, isLoading }: { data: Data | null; isLoading: boolean } =
    useGetNewArrivalsQuery(null);

  return (
    <div className="px-5 md:px-[5%] lg:px-[10%] dark:bg-gray-800 pt-5 pb-20">
      <h1 className="text-2xl font-medium text-slate-700 dark:text-gray-200">
        New Arrivals
      </h1>
      <p className="mt-1 text-slate-600 dark:text-gray-100">See what's new</p>

      <div className="pt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 md:gap-x-6 gap-y-5">
        {isLoading &&
          new Array(5)
            .fill(0)
            .map((_, index) => <ProductCardSkeleton key={index} />)}
        {data &&
          data.success &&
          data.products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        {data &&
          data.success &&
          data.products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        {data &&
          data.success &&
          data.products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        {data &&
          data.success &&
          data.products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        {data &&
          data.success &&
          data.products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
      </div>
    </div>
  );
};

export default NewArrivals;
