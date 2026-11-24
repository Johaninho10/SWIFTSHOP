import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const slides = [
    {
      id: 1,
      badge: "Premium Audio",
      title: "Experience Pure Sound - Your Perfect Headphones Await",
      description: "Immerse yourself in crystal-clear acoustics and active noise cancellation.",
      image: "/headphone.png",
      alt: "Headphones",
      link: "/search?query=audio",
    },
    {
      id: 2,
      badge: "Next-Gen Gaming",
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5!",
      description: "Unleash new gaming possibilities with lightning-fast loading and 4K visuals.",
      image: "/playstation.png",
      alt: "PlayStation 5",
      link: "/search?query=playstation",
    },
    {
      id: 3,
      badge: "Pro Performance",
      title: "Power Meets Elegance - Apple MacBook Pro is Here for You!",
      description: "Supercharged by Apple silicon for unprecedented speed and all-day battery life.",
      image: "/macbook.png",
      alt: "MacBook Pro",
      link: "/search?query=macbook",
    },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-[5%] lg:px-[10%] bg-secondary dark:bg-gray-950 pt-8 transition-colors">
      <div className="relative group">
        {/* Navigation Buttons: positioned cleanly, hidden on mobile for cleaner swiping, visible on tablet+ */}
        <button
          className="hero-prev hidden md:flex absolute top-1/2 -translate-y-1/2 left-3 lg:left-5 z-5 w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-slate-700 dark:text-gray-200 shadow-md hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all justify-center items-center cursor-pointer border border-slate-200/50 dark:border-gray-700/50"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          className="hero-next hidden md:flex absolute top-1/2 -translate-y-1/2 right-3 lg:right-5 z-5 w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-slate-700 dark:text-gray-200 shadow-md hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all justify-center items-center cursor-pointer border border-slate-200/50 dark:border-gray-700/50"
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>

        <Swiper
          spaceBetween={16}
          centeredSlides={true}
          loop
          speed={650}
          grabCursor={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            prevEl: ".hero-prev",
            nextEl: ".hero-next",
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper rounded-2xl sm:rounded-3xl overflow-hidden pb-10"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="flex flex-col-reverse md:flex-row items-center justify-between bg-linear-to-br from-[#EEF2F9] to-[#E2E8F4] dark:from-gray-800/95 dark:to-gray-900/95 py-8 px-6 sm:px-10 md:py-12 md:px-16 lg:px-20 rounded-2xl sm:rounded-3xl border border-slate-200/60 dark:border-gray-700/40 shadow-xs min-h-90 md:min-h-105">
                {/* Content Side */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 sm:space-y-4 max-w-xl mt-4 md:mt-0">
                  

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-slate-800 dark:text-white leading-tight">
                    {slide.title}
                  </h1>

                  

                  <div className="pt-2 sm:pt-3">
                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-7 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all text-sm sm:text-base group"
                    >
                      <span>Shop Now</span>
                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>

                {/* Image Side */}
                <div className="flex justify-center items-center w-full md:w-auto py-2">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-44 sm:w-56 md:w-72 lg:w-80 max-h-56 sm:max-h-72 md:max-h-80 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;