import { useGetPopularCategoriesQuery } from "../app/services/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import Skeleton from "@mui/material/Skeleton";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

type Category = {
  id: string;
  image: string;
  name: string;
};

const PopularCategories = () => {
  const { data, isLoading } = useGetPopularCategoriesQuery(null);

  return (
    <div className="px-4 sm:px-6 md:px-[5%] lg:px-[10%] dark:bg-gray-950 py-2 sm:py-8">
      {/* Header section with title and swiper controls */}
      <div className="flex items-end justify-between mb-4 sm:mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-primary dark:text-blue-400">
            Collections
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-gray-100">
            Popular Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-0.5">
            Explore our curated top-tier categories
          </p>
        </div>

        {/* Custom Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            className="categories-prev w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white shadow-xs hover:shadow-md active:scale-95 transition-all flex justify-center items-center cursor-pointer"
            aria-label="Previous category"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="categories-next w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white shadow-xs hover:shadow-md active:scale-95 transition-all flex justify-center items-center cursor-pointer"
            aria-label="Next category"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <Swiper
        slidesPerView={2.2}
        spaceBetween={12}
        speed={600}
        grabCursor={true}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          480: {
            slidesPerView: 2.5,
            spaceBetween: 14,
          },
          640: {
            slidesPerView: 3.2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3.5,
            spaceBetween: 18,
          },
          1024: {
            slidesPerView: 4.2,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 22,
          },
        }}
        navigation={{
          prevEl: ".categories-prev",
          nextEl: ".categories-next",
        }}
        modules={[Navigation, Autoplay]}
        className="mySwiper py-1"
      >
        {isLoading
          ? new Array(6).fill(0).map((_, index) => (
              <SwiperSlide key={index}>
                <div className="w-full aspect-square rounded-2xl overflow-hidden">
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    className="w-full! h-full! rounded-2xl! dark:bg-gray-800/50!"
                  />
                </div>
              </SwiperSlide>
            ))
          : data?.categories?.map((category: Category) => (
              <SwiperSlide key={category.id} className="py-1">
                <Link
                  to={`/search?category=${category.id}`}
                  className="group relative flex flex-col justify-end w-full aspect-square bg-[#EAEFF8] dark:bg-gray-800 rounded-2xl overflow-hidden p-3.5 sm:p-4 border border-slate-200/70 dark:border-gray-700/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Category Image centered with smooth hover zoom */}
                  <div className="absolute inset-0 p-4 sm:p-5 flex items-center justify-center">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full max-h-[75%] object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent rounded-2xl transition-opacity duration-300 group-hover:from-black/85" />

                  <div className="relative z-10 flex items-center justify-between w-full">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] sm:text-[11px] font-medium text-blue-200 uppercase tracking-wider block">
                        Category
                      </span>
                      <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base truncate drop-shadow-sm group-hover:text-blue-100 transition-colors">
                        {category.name}
                      </h3>
                    </div>

                    {/* Circular Action Indicator */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:bg-primary group-hover:scale-105 transition-all shadow-xs">
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default PopularCategories;