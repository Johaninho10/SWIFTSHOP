import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchInput from "../components/SearchInput";
import { useSearchParams, Link } from "react-router-dom";
import { useGetPopularCategoriesQuery } from "../app/services/categories";
import { ChevronRight, X } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import { useFetchProductsQuery } from "../app/services/products";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import ProductCard from "../components/ProductCard";
import Pagination from "@mui/material/Pagination";

type Image = {
  url: string;
};

type Product = {
  id: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  rate: number;
  reviews: number;
  saved: boolean;
  images: Image[];
};

type Data = {
  success: boolean;
  products: Product[];
  totalPages: number;
  total: number;
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [subCategory, setSubCategory] = useState(
    searchParams.get("subCategory") || "",
  );
  const [showSubcategories, setShowSubCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");

  useEffect(() => {
    const params: { query?: string; category?: string; subCategory?: string } =
      {};
    if (input.trim()) {
      params.query = input.trim();
    }
    if (category) {
      params.category = category;
    }
    if (subCategory) {
      params.subCategory = subCategory;
    }

    setPage(1);

    setSearchParams(params);
  }, [input, category, subCategory, setSearchParams]);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetPopularCategoriesQuery(null);
  const {
    data,
    isLoading,
    isFetching,
  }: { data: Data; isLoading: boolean; isFetching: boolean } =
    useFetchProductsQuery({
      q: query.trim(),
      category,
      subCategory,
      page,
    });

  const clearFilters = () => {
    setCategory("");
    setSubCategory("");
    setQuery("");
    setSearchParams({});
  };

  return (
    <div className="dark:bg-gray-800v pt-[10vh] dark:bg-gray-950 pb-20 min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block lg:w-[20%] bg-slate-100 dark:bg-gray-800 border-r border-slate-200 h-full fixed left-0 pt-10 overflow-auto">
          <div className="flex justify-between items-center px-5">
            <h1 className="text-slate-800 dark:text-gray-400 text-2xl font-medium">
              Filters
            </h1>
            <p
              className="cursor-pointer text-sm flex items-center space-x-1 text-white bg-primary py-2 px-4 rounded-full"
              onClick={() => clearFilters()}
            >
              <X /> <span>Clear Filters</span>
            </p>
          </div>
          <h2 className="mt-3 text-xl text-slate-600 dark:text-gray-300 px-5">
            Categories
          </h2>
          {!categoriesLoading ? (
            categoriesData &&
            categoriesData.success && (
              <ul className="mt-3 flex flex-col">
                {categoriesData.categories.map((item: any) => (
                  <li key={item.id} className="">
                    <div
                      className={` px-4  flex justify-between items-center ${item.id === category ? "bg-primary text-white" : "hover:bg-slate-200 dark:hover:bg-gray-600"} `}
                    >
                      <p
                        className={`flex-1 py-2.5 cursor-pointer h-full  ${item.id === category ? "text-white" : "text-slate-700 dark:text-gray-200"}`}
                        onClick={() => {
                          setSubCategory("");
                          setCategory(item.id);
                        }}
                      >
                        {item.name}
                      </p>
                      {item.subCategories.length > 0 && (
                        <ChevronRight
                          className={`text-slate-400 cursor-pointer transition-all duration-500 ${showSubcategories.includes(item.id) ? "rotate-90 " : "rotation-0"} ${item.id === category && "text-white"}`}
                          onClick={() => {
                            if (showSubcategories.includes(item.id)) {
                              let copy = [...showSubcategories];
                              copy = copy.filter((cat: any) => cat !== item.id);
                              setShowSubCategories(copy);
                            } else {
                              setShowSubCategories((prev) => [
                                ...prev,
                                item.id,
                              ]);
                            }
                          }}
                        />
                      )}
                    </div>

                    <ul
                      className={`bg-white dark:bg-gray-200 ${showSubcategories.includes(item.id) ? "h-auto" : "h-0 overflow-hidden"}`}
                    >
                      {item.subCategories.map((sub: any) => (
                        <li
                          className={`px-12 cursor-pointer py-2 ${sub.id == subCategory ? "bg-primary text-white" : "text-slate-700 hover:bg-primary/80 hover:text-white"}`}
                          onClick={() => {
                            setCategory("");
                            setSubCategory(sub.id);
                          }}
                          key={sub.id}
                        >
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                <li>
                  <Link
                    to={"/categories"}
                    className="px-4 py-2.5 text-primary text-sm flex justify-between items-center"
                  >
                    <span>See all categories</span>
                    <ChevronRight className="text-sm" />
                  </Link>
                </li>
              </ul>
            )
          ) : (
            <div className="flex flex-col gap-y-4 mt-3">
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="h-4! w-9/10! mx-auto! rounded-md!"
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="h-4! w-9/10! mx-auto! rounded-md!"
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="h-4! w-9/10! mx-auto! rounded-md!"
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="h-4! w-9/10! mx-auto! rounded-md!"
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="h-4! w-9/10! mx-auto! rounded-md!"
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="h-4! w-9/10! mx-auto! rounded-md!"
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="h-4! w-9/10! mx-auto! rounded-md!"
              />
            </div>
          )}
        </div>

        <div className="flex-1 lg:ml-[20%] pt-15 px-5">
          <SearchInput
            query={query}
            input={input}
            changeInput={(str: string) => setInput(str)}
            changeQuery={(str: string) => setQuery(str)}
          />

          {query && (
            <>
              <h1 className="mt-8 text-slate-700 text-3xl font-medium">
                Results for <span className="text-primary">"{query}"</span>
              </h1>
            </>
          )}

          {!isLoading && !isFetching && data?.success && (
            <p className="mt-3 text-slate-500">
              Found{" "}
              <span className="text-primary font-medium">{data.total}</span>{" "}
              products
            </p>
          )}

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-5">
            {(isLoading || isFetching) &&
              new Array(12)
                .fill(0)
                .map((_, index) => <ProductCardSkeleton key={index} />)}
            {!isFetching &&
              data &&
              data.success &&
              data.products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
          </div>
          {!isLoading &&
            !isFetching &&
            data?.success &&
            data.totalPages !== 0 && (
              <Pagination
                count={data.totalPages}
                onChange={(_e, page) => setPage(page)}
                page={page}
                className="mt-10!"
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default Search;
