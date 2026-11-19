import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  useGetProductQuery,
  useGetSimilarProductsQuery,
} from "../app/services/products";
import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { Check, Heart, ShoppingCart, Loader } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  useAddToCartMutation,
  useUpdateCartMutation,
} from "../app/services/cart";
import { setCart } from "../app/features/cart";
import BasicRating from "../components/BasicRating";
import { useNavigate } from "react-router-dom";
import { useToggleWishMutation } from "../app/services/products";
import { useFetchReviewsQuery } from "../app/services/reviews";
import AddReview from "../components/AddReview";
import ReviewItem from "../components/ReviewItem";
import { motion } from "motion/react";
import UpdateReview from "../components/UpdateReview";
import ShowReviews from "../components/ShowReviews";
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
  colors: string[];
  images: Image[];
};

type Data = {
  success: boolean;
  message?: boolean;
  product?: Product;
};

type CartItems = {
  product: Product;
  quantity: number;
  color: string;
};

type Cart = {
  cart: CartItems[];
};

type User = {
  user: {
    id: string;
  };
};

type Store = {
  cart: Cart;
  user: User;
};

const Details = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState("1");

  if (!id) {
    return <div>Error</div>;
  }
  const {
    data,
    isLoading,
    error,
  }: { data: Data; isLoading: boolean; error: Error } = useGetProductQuery(id);

  const { data: similarProductsData, isLoading: similarProductsLoading } =
    useGetSimilarProductsQuery(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [saved, setSaved] = useState(false);
  const dispatch = useDispatch();

  const cart = useSelector((store: Store) => store.cart.cart);
  const user = useSelector((store: Store) => store.user.user);
  const navigate = useNavigate();

  const [toggleWish, { isLoading: toggleLoading }] = useToggleWishMutation();
  const [showAddReview, setShowAddReview] = useState(false);
  const [showUpdateReview, setShowUpdateReview] = useState(false);

  const handleToggleWish = async () => {
    try {
      if (!user) {
        return navigate("/signin");
      }
      const result = await toggleWish({ productId: product?.id }).unwrap();

      if (result.success) {
        setSaved(!saved);
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const [selectedReview, setSelectedReview] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [addToCart, { isLoading: addToCartLoading }] = useAddToCartMutation();
  const [updateCart, { isLoading: updateCartLoading }] =
    useUpdateCartMutation();
  const { data: reviewsData, isLoading: isReviewsLoading } =
    useFetchReviewsQuery({
      productId: id,
      page: 1,
    });

  const handleAddToCart = async () => {
    const cartItem = cart.find(
      (item) => item.product.id === id && item.color === selectedColor,
    );
    let result;
    if (!cartItem) {
      result = await addToCart({
        productId: id,
        quantity: Number(quantity),
        color: selectedColor,
      }).unwrap();

      dispatch(setCart([...cart, result.cartItem]));
    } else {
      let cartCopy = [...cart];
      result = await updateCart({
        productId: id,
        quantity: cartItem.quantity + Number(quantity),
        color: selectedColor,
      }).unwrap();

      cartCopy = cartCopy.map((item) => {
        if (item.product.id === id) {
          return {
            ...item,
            quantity: cartItem.quantity + Number(quantity),
          };
        }
        return item;
      });
      dispatch(setCart([...cartCopy]));
    }

    if (result.success) {
      toast.success(result.message);
    } else {
      throw new Error(result.message);
    }
    try {
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (error) {
    return <div>Something went wrong</div>;
  }

  useEffect(() => {
    if (data?.product) {
      setProduct(data.product);
      setSaved(data.product.saved);
      setSelectedImage(data.product.images[0].url);
      setSelectedColor(data.product.colors[0]);
    }
  }, [data, isLoading]);

  return (
    <div className="min-h-screen dark:bg-gray-950 pt-[10vh]">
      <Navbar />

      {/* ── Main Product Section (Images & Info) ── */}
      <div className="px-5 md:px-[5%] lg:px-[10%] grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5 pt-10">
        {/* Left Column: Image Gallery */}
        <div className="w-full flex flex-col min-w-0 gap-x-5 gap-y-5">
          {isLoading ? (
            <div className="w-full">
              <Skeleton
                variant="rounded"
                animation="wave"
                className="w-full! h-90! rounded-2xl! dark:bg-gray-800/50!"
              />
            </div>
          ) : (
            product && (
              <motion.div
                initial={{ x: -20, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="bg-[#E6E9F2] dark:bg-gray-800 h-90 rounded-2xl overflow-hidden w-full flex justify-center items-center relative"
              >
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="h-80 object-contain"
                />
                <button
                  disabled={toggleLoading}
                  className="w-11 h-11 rounded-full bg-white flex justify-center items-center absolute right-3 top-3 shadow-sm hover:scale-105 transition-transform"
                  onClick={handleToggleWish}
                >
                  {toggleLoading ? (
                    <div className="w-5 h-5 rounded-full border border-primary border-b-transparent animate-spin"></div>
                  ) : user && saved ? (
                    <Heart className="text-red-500" fill="currentColor" />
                  ) : (
                    <Heart className="text-slate-600" />
                  )}
                </button>
              </motion.div>
            )
          )}

          {/* Thumbnail strip */}
          {isLoading ? (
            <div className="flex w-full gap-x-3">
              {new Array(4).fill(0).map((_, index) => (
                <div className="w-full" key={index}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    className="w-full! h-20! md:h-24! rounded-xl! dark:bg-gray-800/50!"
                  />
                </div>
              ))}
            </div>
          ) : (
            data?.product && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Swiper
                  navigation={true}
                  loop
                  modules={[Navigation, Autoplay]}
                  className="mySwiper w-full swiper"
                  slidesPerView={4}
                  spaceBetween={10}
                  style={{
                    paddingInline: 2,
                  }}
                >
                  {data.product.images.map((item) => (
                    <SwiperSlide
                      className={`bg-[#E6E9F2] dark:bg-gray-800 rounded-xl cursor-pointer py-2 ${
                        selectedImage === item.url
                          ? "border-2 border-primary/70"
                          : ""
                      }`}
                      key={item.url}
                      onClick={() => setSelectedImage(item.url)}
                    >
                      <img
                        src={item.url}
                        alt=""
                        className="h-20 md:h-24 w-8/10 mx-auto object-contain"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            )
          )}
        </div>

        {/* Right Column: Product Metadata */}
        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex flex-col gap-y-2">
              <Skeleton
                variant="rounded"
                animation="wave"
                className="h-8! w-4/5! rounded-lg! dark:bg-gray-800/50!"
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                className="h-8! w-1/2! rounded-lg! dark:bg-gray-800/50!"
              />
            </div>
          ) : (
            product && (
              <h1 className="text-3xl text-slate-700 font-medium line-clamp-2 dark:text-gray-300">
                {product.title}
              </h1>
            )
          )}

          {isLoading ? (
            <Skeleton
              variant="rounded"
              animation="wave"
              className="w-32! h-5! rounded-md! mt-4! dark:bg-gray-800/50!"
            />
          ) : (
            data?.product && (
              <p className="text-xl text-slate-400 mt-3">
                {data.product.brand}
              </p>
            )
          )}

          {isLoading ? (
            <Skeleton
              variant="rounded"
              animation="wave"
              className="w-36! h-7! mt-4! rounded-md! dark:bg-gray-800/50!"
            />
          ) : (
            product && (
              <p className="text-xl text-primary font-medium mt-3">
                FCFA {product.price.toLocaleString()}
              </p>
            )
          )}

          {isLoading ? (
            <div className="flex items-center gap-3 mt-5">
              <Skeleton
                variant="rounded"
                animation="wave"
                className="w-28! h-5! rounded-md! dark:bg-gray-800/50!"
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                className="w-20! h-5! rounded-md! dark:bg-gray-800/50!"
              />
            </div>
          ) : (
            data?.product && (
              <div className="flex items-center space-x-4 mt-5">
                <BasicRating rate={data.product.rate} readOnly={true} />
                <p className="text-slate-600 dark:text-gray-300">
                  {Number(data.product.rate).toFixed(1)} ({data.product.reviews}
                  )
                </p>
              </div>
            )
          )}

          {isLoading ? (
            <div className="mt-5">
              <Skeleton
                variant="rounded"
                animation="wave"
                className="w-16! h-3.5! rounded! mb-2.5! dark:bg-gray-800/50!"
              />
              <div className="flex items-center gap-x-3">
                {new Array(4).fill(0).map((_, index) => (
                  <Skeleton
                    variant="circular"
                    animation="wave"
                    className="w-10! h-10! dark:bg-gray-800/50!"
                    key={index}
                  />
                ))}
              </div>
            </div>
          ) : (
            data?.product && (
              <div className="flex items-center space-x-4 mt-5">
                {data.product.colors.map((item, index) => (
                  <div
                    className={`w-10 h-10 rounded-full ${
                      selectedColor === item ? "border-2 border-primary" : ""
                    } flex justify-center items-center`}
                    key={index}
                  >
                    <button
                      className={`h-8 w-8 rounded-full flex justify-center items-center ${
                        item === selectedColor
                          ? "border border-primary/75"
                          : "ring-slate-400"
                      }`}
                      style={{
                        backgroundColor: item,
                        border: "1px solid #ccc",
                      }}
                      onClick={() => setSelectedColor(item)}
                    >
                      {selectedColor === item && (
                        <Check className="text-primary/75" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {isLoading ? (
            <div className="flex space-x-3 items-center mt-5">
              <Skeleton
                variant="circular"
                animation="wave"
                className="w-8! h-8! dark:bg-gray-800/50!"
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                className="w-10! h-8! rounded-md! dark:bg-gray-800/50!"
              />
              <Skeleton
                variant="circular"
                animation="wave"
                className="w-8! h-8! dark:bg-gray-800/50!"
              />
            </div>
          ) : (
            product && (
              <div className="flex space-x-4 items-center mt-5">
                <button
                  className="w-8 h-8 rounded-full bg-red-300 text-red-500 flex justify-center items-center text-2xl"
                  disabled={isLoading}
                  onClick={async () => {
                    if (Number(quantity) !== 1) {
                      setQuantity((prev) => String(Number(prev) - 1));
                    }
                  }}
                >
                  -
                </button>

                <input
                  type="text"
                  className="w-8 h-8 text-center border border-slate-200 dark:border-gray-500 dark:text-white rounded-md focus:ring-2 focus:ring-primary transition-all duration-300"
                  value={quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (isNaN(value)) {
                      e.preventDefault();
                    } else {
                      setQuantity(e.target.value);
                    }
                  }}
                  onBlur={async () => {
                    const value = Number(quantity);
                    if (value === 0 || isNaN(value)) {
                      setQuantity("1");
                    }
                  }}
                />
                <button
                  className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-500 flex justify-center items-center text-2xl"
                  disabled={isLoading}
                  onClick={async () => {
                    setQuantity((prev) => String(Number(prev) + 1));
                  }}
                >
                  +
                </button>
              </div>
            )
          )}

          {isLoading ? (
            <Skeleton
              variant="rounded"
              animation="wave"
              className="w-44! h-12! rounded-lg! mt-5! dark:bg-gray-800/50!"
            />
          ) : (
            product && (
              <button
                disabled={addToCartLoading || updateCartLoading}
                className="bg-primary dark:bg-white dark:text-primary text-white py-3 rounded-lg flex justify-center items-center mt-5 font-medium px-6 w-fit cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleAddToCart}
              >
                {addToCartLoading || updateCartLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Add to Cart</span>
                    <ShoppingCart className="group-hover:scale-115 transition-all duration-300" />
                  </div>
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* ── Product Description & Customer Reviews Section ── */}
      {isLoading ? (
        /* Full Loading Skeleton for Description & Reviews */
        <div className="px-5 md:px-[5%] lg:px-[10%] mt-12 pb-16">
          {/* Description Skeleton */}
          <div className="mb-10">
            <Skeleton
              variant="rounded"
              animation="wave"
              className="w-48! h-6! rounded-md! mb-4! dark:bg-gray-800/50!"
            />
            <div className="space-y-2.5 max-w-4xl">
              <Skeleton
                variant="rounded"
                animation="wave"
                className="w-full! h-4! rounded! dark:bg-gray-800/50!"
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                className="w-11/12! h-4! rounded! dark:bg-gray-800/50!"
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                className="w-4/5! h-4! rounded! dark:bg-gray-800/50!"
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                className="w-3/5! h-4! rounded! dark:bg-gray-800/50!"
              />
            </div>
          </div>
          {/* Reviews Header Skeleton */}
          <div className="mt-8">
            <Skeleton
              variant="rounded"
              animation="wave"
              className="w-44! h-6! rounded-md! mb-6! dark:bg-gray-800/50!"
            />

            <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_3fr] gap-x-10 gap-y-5 items-start">
              {/* Left Summary Card Skeleton */}
              <div className="w-full bg-[#EEF0FF]/50 dark:bg-gray-800/80 rounded-2xl py-14 px-4 flex flex-col gap-y-3 justify-center items-center border border-slate-100 dark:border-gray-700">
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  className="w-16! h-10! rounded-md! dark:bg-gray-800/50!"
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  className="w-32! h-5! rounded-md! dark:bg-gray-800/50!"
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  className="w-40! h-4! rounded-md! dark:bg-gray-800/50!"
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  className="w-full! h-10! rounded-md! mt-2! dark:bg-gray-800/50!"
                />
              </div>

              {/* Right Review List Skeletons */}
              <div className="flex flex-col gap-y-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="py-5 bg-white dark:bg-gray-900 rounded-xl px-5 shadow-[0px_0px_10px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-gray-600/50"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-x-4">
                        <Skeleton
                          variant="circular"
                          animation="wave"
                          className="w-12! h-12! dark:bg-gray-800/50!"
                        />
                        <div className="flex flex-col gap-y-1.5">
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            className="w-32! h-4! rounded! dark:bg-gray-800/50!"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            className="w-20! h-3! rounded! dark:bg-gray-800/50!"
                          />
                        </div>
                      </div>
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        className="w-24! h-4! rounded! dark:bg-gray-800/50!"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        className="w-full! h-3.5! rounded! dark:bg-gray-800/50!"
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        className="w-4/5! h-3.5! rounded! dark:bg-gray-800/50!"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        product && (
          <div className="px-5 md:px-[5%] lg:px-[10%] mt-10 pb-16">
            <div className="text-primary text-xl font-medium">
              Product Description
            </div>
            <div className="mt-4 text-slate-600/80 dark:text-gray-400 leading-relaxed max-w-4xl">
              {product.description}
            </div>

            <div className="mt-8">
              <h2 className="text-slate-700 dark:text-slate-300 font-medium text-xl mb-5">
                Customer Reviews
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_3fr] gap-x-10 gap-y-5 items-start">
                {/* Rating Summary Card */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="w-full bg-[#EEF0FF] dark:bg-gray-800 rounded-2xl py-14 px-5 flex flex-col gap-y-3 justify-center items-center border border-slate-100 dark:border-gray-700 shadow-sm"
                >
                  <p className="text-primary text-4xl font-bold">
                    {Number(product.rate).toFixed(1)}
                  </p>
                  <BasicRating rate={product.rate} readOnly={true} />
                  <p className="text-base text-slate-600 dark:text-gray-300 text-center">
                    Based on {product.reviews} review
                    {product.reviews !== 1 ? "s" : ""}
                  </p>
                  <button
                    className="py-2.5 bg-primary hover:opacity-90 active:scale-95 transition-all rounded-xl w-full text-white text-sm font-semibold mt-1 cursor-pointer"
                    onClick={() => {
                      if (!user) {
                        navigate("/signin");
                      } else {
                        setShowAddReview(true);
                      }
                    }}
                  >
                    Write a review
                  </button>
                </motion.div>

                {/* Reviews List or Reviews Skeletons */}
                <div className="flex flex-col gap-y-4">
                  {isReviewsLoading ? (
                    [1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="py-5 bg-white dark:bg-gray-800/50 rounded-xl px-5 shadow-[0px_0px_10px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-gray-600/50"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-x-4">
                            <Skeleton
                              variant="circular"
                              animation="wave"
                              className="w-12! h-12! dark:bg-gray-800/50!"
                            />
                            <div className="flex flex-col gap-y-1.5">
                              <Skeleton
                                variant="rounded"
                                animation="wave"
                                className="w-32! h-4! rounded! dark:bg-gray-800/50!"
                              />
                              <Skeleton
                                variant="rounded"
                                animation="wave"
                                className="w-20! h-3! rounded! dark:bg-gray-800/50!"
                              />
                            </div>
                          </div>
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            className="w-24! h-4! rounded! dark:bg-gray-800/50!"
                          />
                        </div>
                        <div className="mt-4 space-y-2">
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            className="w-full! h-3.5! rounded! dark:bg-gray-800/50!"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            className="w-4/5! h-3.5! rounded! dark:bg-gray-800/50!"
                          />
                        </div>
                      </div>
                    ))
                  ) : reviewsData &&
                    reviewsData.success &&
                    reviewsData.reviews.length > 0 ? (
                    reviewsData.reviews.map((review: any) => (
                      <ReviewItem
                        key={review.id}
                        review={review}
                        changeUpdateReview={(value: boolean) =>
                          setShowUpdateReview(value)
                        }
                        selectReview={(id: string) => setSelectedReview(id)}
                        changeShowReviews={(value: boolean) =>
                          setShowAllReviews(value)
                        }
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center bg-white dark:bg-gray-700/50 rounded-xl border border-slate-100 dark:border-gray-600/50 text-slate-500 dark:text-gray-400 text-sm">
                      No reviews yet for this product. Be the first to write a
                      review!
                    </div>
                  )}

                  {reviewsData && reviewsData.totalPages > 1 && (
                    <p className="text-primary text-base font-medium text-center mt-2">
                      <span
                        className="cursor-pointer underline hover:opacity-80 transition-opacity"
                        onClick={() => setShowAllReviews(true)}
                      >
                        View all {reviewsData.total} review
                        {reviewsData.total > 1 ? "s" : ""}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="dark:bg-gray-950 mt-10">
              {similarProductsData &&
                similarProductsData.products.length !== 0 && (
                  <h1 className="my-5 text-2xl text-slate-700 font-medium dark:text-gray-300">
                    You might also like
                  </h1>
                )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-5">
                {similarProductsLoading
                  ? new Array(5)
                      .fill(0)
                      .map((_, index) => <ProductCardSkeleton key={index} />)
                  : similarProductsData.products.map((product: any) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
              </div>
            </div>
          </div>
        )
      )}

      {showAddReview && (
        <AddReview
          changeAddReview={(value: boolean) => setShowAddReview(value)}
        />
      )}
      {showUpdateReview && (
        <UpdateReview
          changeUpdateReview={(value: boolean) => setShowUpdateReview(value)}
          reviewId={selectedReview}
        />
      )}
      {showAllReviews && (
        <ShowReviews
          changeShowReviews={() => setShowAllReviews(false)}
          selectReview={(id: string) => setSelectedReview(id)}
          changeUpdateReview={(value: boolean) => setShowUpdateReview(value)}
        />
      )}
    </div>
  );
};

export default Details;
