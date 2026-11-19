import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const prevEl = useRef<HTMLButtonElement>(null);
  const nextEl = useRef<HTMLButtonElement>(null);
  return (
    <div className="px-5 md:px-[5%] lg:px-[10%] bg-secondary dark:bg-gray-950 py-10 transition-all">
      <div className="relative">
        <button
          ref={prevEl}
          className="bg-primary text-white w-10 h-10 rounded-full flex justify-center items-center absolute top-1/2 left-5 z-5"
        >
          <ChevronLeft />
        </button>

        <button
          ref={nextEl}
          className="bg-primary text-white w-10 h-10 rounded-full flex justify-center items-center absolute top-1/2 right-5 z-5"
        >
          <ChevronRight />
        </button>
        <Swiper
          spaceBetween={20}
          centeredSlides={true}
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
          }}
            onBeforeInit={(swiper) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
              swiper.params.navigation.prevEl = prevEl.current;
              swiper.params.navigation.nextEl = nextEl.current;
            }
          }}
          navigation={{
            prevEl: prevEl.current,
            nextEl: nextEl.current,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide className="flex! flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] dark:bg-gray-800 py-8 md:px-20 px-5 mt-6 rounded-xl min-w-full">
            <div className="flex flex-col space-y-4">
              <h1 className="max-w-lg md:text-[40px] md:leading-12 text-2xl font-semibold text-slate-700 dark:text-white max-md:text-center">
                Experience Pure Sound - Your Perfect Headphones Awaits
              </h1>
              <button className="bg-primary text-white py-3 rounded-md px-8 self-start mt-5">
                Shop Now
              </button>
            </div>

            <img
              src="/headphone.png"
              alt=""
              className="md:w-72 w-48 aspect-square"
            />
          </SwiperSlide>

          <SwiperSlide className="flex! flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] dark:bg-gray-800 py-8 md:px-20 px-5 mt-6 rounded-xl min-w-full">
            <div className="flex flex-col space-y-4">
              <h1 className="max-w-lg md:text-[40px] md:leading-12 text-2xl font-semibold text-slate-700 dark:text-white max-md:text-center">
                Next-Level Gaming Starts Here - Discover PlayStation 5 Today!
              </h1>
              <button className="bg-primary text-white py-3 rounded-md px-8 self-start mt-5">
                Shop Now
              </button>
            </div>

            <img
              src="/playstation.png"
              alt=""
              className="md:w-72 w-48 aspect-square"
            />
          </SwiperSlide>

          <SwiperSlide className="flex! flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] dark:bg-gray-800 py-8 md:px-20 px-5 mt-6 rounded-xl min-w-full">
            <div className="flex flex-col space-y-4">
              <h1 className="max-w-lg md:text-[40px] md:leading-12 text-2xl font-semibold text-slate-700 dark:text-white max-md:text-center">
                Power Meets Elegance - Apple MacBook Pro is Here for you!
              </h1>
              <button className="bg-primary text-white py-3 rounded-md px-8 self-start mt-5">
                Shop Now
              </button>
            </div>

            <img
              src="/macbook.png"
              alt=""
              className="md:w-72 w-48 aspect-square"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
