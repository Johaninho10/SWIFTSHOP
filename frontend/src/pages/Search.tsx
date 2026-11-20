import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchInput from "../components/SearchInput";
import { useSearchParams, Link } from "react-router-dom";
import { useGetPopularCategoriesQuery } from "../app/services/categories";
import {
  ChevronRight,
  X,
  SlidersHorizontal,
  RotateCcw,
  PackageSearch,
} from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import Pagination from "@mui/material/Pagination";
import { useFetchProductsQuery } from "../app/services/products";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSubCategory = searchParams.get("subCategory") || "";

  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [subCategory, setSubCategory] = useState(initialSubCategory);
  const [showSubcategories, setShowSubCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (query.trim()) params.query = query.trim();
    if (category) params.category = category;
    if (subCategory) params.subCategory = subCategory;

    setPage(1);
    setSearchParams(params);
  }, [query, category, subCategory, setSearchParams]);

  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlSubCategory = searchParams.get("subCategory") || "";

    if (urlQuery !== query) {
      setQuery(urlQuery);
      setInput(urlQuery);
    }
    if (urlCategory !== category) {
      setCategory(urlCategory);
    }
    if (urlSubCategory !== subCategory) {
      setSubCategory(urlSubCategory);
    }
  }, [searchParams]);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetPopularCategoriesQuery(null);

  const {
    data,
    isLoading,
    isFetching,
  }: { data?: Data; isLoading: boolean; isFetching: boolean } =
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
    setInput("");
    setPage(1);
    setSearchParams({});
  };

  const selectedCategoryObj = categoriesData?.categories?.find(
    (c: any) => c.id === category,
  );

  const selectedSubCategoryObj = categoriesData?.categories
    ?.flatMap((c: any) => c.subCategories || [])
    ?.find((sc: any) => sc.id === subCategory);

  const activeFiltersCount =
    (category ? 1 : 0) + (subCategory ? 1 : 0) + (query.trim() ? 1 : 0);

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-primary" />
          <h2 className="text-slate-800 dark:text-gray-100 text-lg font-semibold py-2">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={() => {
              clearFilters();
              if (isMobile) setMobileFilterOpen(false);
            }}
            className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 flex items-center gap-1 transition"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Tree */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-gray-400">
            Categories
          </span>
        </div>

        <button
          onClick={() => {
            setCategory("");
            setSubCategory("");
            if (isMobile) setMobileFilterOpen(false);
          }}
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between mb-1.5 ${
            !category && !subCategory
              ? "bg-primary text-white shadow-sm"
              : "text-slate-700 dark:text-gray-300 hover:bg-slate-200/60 dark:hover:bg-gray-800"
          }`}
        >
          <span>All Categories</span>
        </button>

        {!categoriesLoading ? (
          categoriesData?.success && (
            <ul className="space-y-1">
              {categoriesData.categories.map((item: any) => {
                const isSelected = item.id === category;
                const hasSub =
                  item.subCategories && item.subCategories.length > 0;
                const isExpanded = showSubcategories.includes(item.id);

                return (
                  <li key={item.id} className="rounded-xl overflow-hidden">
                    <div
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-700 dark:text-gray-300 hover:bg-slate-200/60 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span
                        className="flex-1 text-sm font-medium select-none truncate"
                        onClick={() => {
                          setSubCategory("");
                          setCategory(isSelected ? "" : item.id);
                          if (isMobile && !isSelected)
                            setMobileFilterOpen(false);
                        }}
                      >
                        {item.name}
                      </span>

                      {hasSub && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSubCategories((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((id) => id !== item.id)
                                : [...prev, item.id],
                            );
                          }}
                          className={`p-1 rounded-lg transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : ""
                          } ${
                            isSelected
                              ? "text-white/80 hover:text-white"
                              : "text-slate-400 hover:text-slate-600 dark:hover:text-gray-200"
                          }`}
                        >
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>

                    {hasSub && isExpanded && (
                      <ul className="mt-1 ml-3 pl-3 border-l-2 border-slate-200 dark:border-gray-700 space-y-1 py-1">
                        {item.subCategories.map((sub: any) => {
                          const isSubSelected = sub.id === subCategory;
                          return (
                            <li key={sub.id}>
                              <button
                                onClick={() => {
                                  setCategory("");
                                  setSubCategory(isSubSelected ? "" : sub.id);
                                  if (isMobile) setMobileFilterOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition truncate ${
                                  isSubSelected
                                    ? "bg-primary text-white font-semibold shadow-sm"
                                    : "text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-800"
                                }`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )
        ) : (
          <div className="space-y-3 mt-3 px-1">
            {new Array(6).fill(0).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                animation="wave"
                className="h-8! w-full! rounded-xl! dark:bg-gray-800/60!"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-[10vh] pb-24">
      <Navbar />

      <div className="flex">
        {/* Desktop Sticky Sidebar */}
        <aside className="fixed top-[10vh] bottom-0 hidden lg:block w-64 xl:w-72 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 overflow-y-auto">
          {renderSidebarContent(false)}
        </aside>

        {/* Mobile Filter Drawer (Slides in from the LEFT) */}
        <div
          className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
            mobileFilterOpen ? "visible" : "invisible pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
              mobileFilterOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Panel on the LEFT */}
          <div
            className={`relative mr-auto w-full max-w-xs sm:max-w-sm bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-in-out ${
              mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                <span className="font-bold text-slate-800 dark:text-gray-100 text-base">
                  Filter Products
                </span>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderSidebarContent(true)}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-8 w-full lg:ml-64 xl:ml-72">
          {/* Top Search Bar */}
          <div className="mb-6">
            <SearchInput
              query={query}
              input={input}
              changeInput={(str: string) => setInput(str)}
              changeQuery={(str: string) => setQuery(str)}
            />
          </div>

          {/* Controls Bar: Mobile filter button + Search result title + Count */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Trigger Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl shadow-xs text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800 transition"
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Title Header */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-gray-100">
                  {query ? (
                    <>
                      Results for{" "}
                      <span className="text-primary">"{query}"</span>
                    </>
                  ) : selectedCategoryObj ? (
                    selectedCategoryObj.name
                  ) : selectedSubCategoryObj ? (
                    selectedSubCategoryObj.name
                  ) : (
                    "All Products"
                  )}
                </h1>
                {!isLoading && !isFetching && data?.success && (
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    Found{" "}
                    <span className="font-semibold text-slate-700 dark:text-gray-300">
                      {data.total}
                    </span>{" "}
                    {data.total === 1 ? "product" : "products"}
                  </p>
                )}
              </div>
            </div>

            {/* Clear all active filters link */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-slate-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary flex items-center gap-1.5 transition py-1"
              >
                <RotateCcw size={13} />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium mr-1">
                Active:
              </span>

              {query && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                  <span>Search: "{query}"</span>
                  <button
                    onClick={() => {
                      setQuery("");
                      setInput("");
                    }}
                    className="hover:opacity-75"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {selectedCategoryObj && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                  <span>Category: {selectedCategoryObj.name}</span>
                  <button
                    onClick={() => setCategory("")}
                    className="hover:opacity-75"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {selectedSubCategoryObj && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                  <span>Subcategory: {selectedSubCategoryObj.name}</span>
                  <button
                    onClick={() => setSubCategory("")}
                    className="hover:opacity-75"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid or Skeletons or Empty State */}
          {isLoading || isFetching ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
              {new Array(10).fill(0).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : data?.success && data.products.length === 0 ? (
            /* ── EMPTY STATE ── */
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 dark:bg-primary/20 border border-primary/20 flex items-center justify-center shadow-xs">
                  <PackageSearch
                    className="w-12 h-12 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                
              </div>

              <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-2">
                No products found
              </h2>

              <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                {query
                  ? `We couldn't find any products matching "${query}" with your active filters. Try checking your spelling or adjusting filters.`
                  : "We couldn't find any products matching the selected filters. Try clearing some filters to see more results."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 active:scale-95 transition shadow-sm"
                  >
                    <RotateCcw size={15} />
                    <span>Clear all filters</span>
                  </button>
                )}
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-gray-700 transition"
                >
                  <span>Explore homepage</span>
                </Link>
              </div>

              {/* Quick Category Suggestions */}
              {categoriesData?.categories?.length > 0 && (
                <div className="w-full pt-6 border-t border-slate-200 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-gray-500 font-semibold mb-3">
                    Explore categories
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categoriesData.categories.slice(0, 5).map((cat: any) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategory(cat.id);
                          setSubCategory("");
                          setQuery("");
                          setInput("");
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-gray-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-700 dark:text-gray-300 font-medium transition"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── PRODUCT CARDS GRID ── */
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
                {data?.products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    count={data.totalPages}
                    page={page}
                    onChange={(_e, p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    color="primary"
                    shape="rounded"
                    size="medium"
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
