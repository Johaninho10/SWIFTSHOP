import { useGetPopularCategoriesQuery } from "../app/services/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";



type Category = {
  id: string;
  image: string;
  name: string;
};

const PopularCategories = () => {
  const { data, isLoading } = useGetPopularCategoriesQuery(null);
  const prevEl = useRef<HTMLButtonElement>(null);
  const nextEl = useRef<HTMLButtonElement>(null);

  return (
    <div className="px-5 md:px-[5%] lg:px-[10%] dark:bg-gray-800">
      <h1 className="text-2xl font-medium text-slate-700 dark:text-gray-200">
        Popular Categories
      </h1>
      <div className="flex justify-between">
        <p className="mt-1 text-slate-600 dark:text-gray-100">
          See what's trendy right now
        </p>
        <div className="flex items-center space-x-2">
          <button
            ref={prevEl}
            className="categories-prev w-8 h-8 rounded-full bg-primary dark:bg-white text-white dark:text-primary flex justify-center items-center"
          >
            <ChevronLeft />
          </button>
          <button
            ref={nextEl}
            className="categories-next w-8 h-8 rounded-full bg-primary dark:bg-white text-white dark:text-primary flex justify-center items-center"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      {
        <Swiper
          spaceBetween={30}
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          slidesPerView={2}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1280: {
              slidesPerView: 5,
            },
          }}
          navigation={{
            prevEl: prevEl.current,
            nextEl: nextEl.current,
          }}
          modules={[Navigation, Autoplay]}
          className="mySwiper mt-3"
        >
          {isLoading
            ? new Array(5).fill(0).map((_, index) => (
                <SwiperSlide key={index}>
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    className="w-full! h-50! rounded-2xl!"
                  />
                </SwiperSlide>
              ))
            : data &&
              data.categories &&
              data.categories.map((category: Category) => (
                <SwiperSlide
                  className="rounded-2xl overflow-hidden"
                  key={category.id}
                >
                  <Link
                    to={`/search?category=${category.id}`}
                    className="relative bg-[#E6E9F2] rounded-2xl overflow-hidden py-3 w-full group cursor-pointer"
                  >
                    <img
                      src={category.image}
                      alt=""
                      className="w-50 aspect-square object-cover mx-auto group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute left-0 right-0 top-0 bottom-0 bg-black/20">
                      <div className="absolute bottom-5 left-10 text-white text-xl font-medium transition-all">
                        {category.name}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
        </Swiper>
      }
    </div>
  );
};

export default PopularCategories;
