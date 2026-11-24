import { Link, useNavigate } from "react-router-dom";
import BasicRating from "./BasicRating";
import { useEffect, useState } from "react";
import { useToggleWishMutation } from "../app/services/products";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "motion/react";

import { Heart, Loader } from "lucide-react";

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

type User = {
  user: {};
};

type CartItems = {
  product: Product;
  quantity: number;
};

type Cart = {
  cart: CartItems[];
};

type Store = {
  user: User;
  cart: Cart;
};

const ProductCard = (product: Product) => {
  const [saved, setSaved] = useState<boolean>(product.saved);

  const [toggleWish, { isLoading }] = useToggleWishMutation();
  const [imageLoading, setImageLoading] = useState(true)

  const originalUrl = product.images?.[0]?.url || "";

  // Cloudinary blur transformation for low-quality image placeholder (LQIP)
  const getBlurredUrl = (src: string) => {
    if (!src) return "";
    if (src.includes("e_blur")) return src;
    return src.includes("/upload")
      ? src.replace("/upload", "/upload/w_50,q_auto,e_blur:800")
      : src;
  };

  
  const [url, setUrl] = useState<string>(() => getBlurredUrl(originalUrl));

  useEffect(() => {
    setUrl(getBlurredUrl(originalUrl));
    setImageLoading(true);
  }, [originalUrl]);

  const user = useSelector((store: Store) => store.user.user);
  const navigate = useNavigate();

  const handleToggleWish = async () => {
    try {
      if (!user) {
        return navigate("/signin");
      }
      const result = await toggleWish({ productId: product.id }).unwrap();

      if (result.success) {
        toast.success(!saved ? "Added to wishlist" : "Removed from wishlist");
        setSaved(!saved);
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="bg-[#E6E9F2] dark:bg-gray-800 rounded-xl overflow-hidden w-full h-50 aspect-square group relative flex items-center justify-center">
        <Link
          className="w-full h-full p-4 sm:p-5 flex items-center justify-center"
          to={`/product/${product.id}`}
        >
          <img
            src={url || originalUrl}
            alt={product.title || "product"}
            className={`w-full h-full max-h-full max-w-full object-contain transition-all duration-200 ease-out group-hover:scale-115 ${
              imageLoading
                ? "blur-xs scale-95 opacity-80"
                : "blur-0 scale-100 opacity-100"
            }`}
            loading="lazy"
            onLoad={() => {
              if (originalUrl && url !== originalUrl) {
                setUrl(originalUrl);
              } else {
                setImageLoading(false);
              }
            }}
          />
        </Link>
        <button
          disabled={isLoading}
          aria-label="Add to wishlist"
          className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-xs shadow-xs hover:shadow-md hover:scale-110 active:scale-95 transition-all flex justify-center items-center absolute right-2.5 top-2.5 cursor-pointer"
          onClick={handleToggleWish}
        >
          {isLoading ? (
            <Loader size={20} className="text-primary animate-spin" />
          ) : user && saved ? (
            <Heart size={20} className="text-red-500" fill="currentColor" />
          ) : (
            <Heart size={20} className="text-slate-600" />
          )}
        </button>
      </div>
      <div className="flex flex-col space-y-0.5">
        <h2 className="text-slate-700 dark:text-gray-400 font-medium w-full truncate mt-2">
          {product.title}
        </h2>
        <p className="text-slate-500 ">{product.brand}</p>
        <div className="flex justify-between">
          <BasicRating rate={product.rate} readOnly={true} />
          <p className="text-slate-500 dark:text-gray-300 text-sm">
            {Number(product.rate).toFixed(1)} ({product.reviews})
          </p>
        </div>
        <p className="text-primary font-medium dark:text-white text-[18px]">
          {product.price.toLocaleString()} FCFA
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
