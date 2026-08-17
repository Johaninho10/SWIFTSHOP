import { Link, useNavigate } from "react-router-dom";
import BasicRating from "./BasicRating";
import { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useToggleWishMutation } from "../app/services/products";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "motion/react";

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

type User = {
  user: {};
};

type Store = {
  user: User;
};

const ProductCard = (product: Product) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [saved, setSaved] = useState<boolean>(product.saved);

  const [toggleWish, { isLoading }] = useToggleWishMutation();

  const user = useSelector((store: Store) => store.user.user);
  const navigate = useNavigate();

  const handleToggle = async () => {
    try {
      if (!user) {
        return navigate("/signin");
      }
      const result = await toggleWish({ productId: product.id }).unwrap();

      if (result.success) {
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
      <div className="bg-[#E6E9F2] rounded-lg overflow-hidden w-full h-40 md:h-50 flex justify-center items-center group relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0].url}
            alt="product"
            className="w-full object-cover group-hover:scale-110 transition-all duration-300"
          />
        </Link>
        <button
          disabled={isLoading}
          className="w-11 h-11 rounded-full bg-white flex justify-center items-center absolute right-2 top-2"
          onClick={handleToggle}
        >
          {isLoading ? (
            <div className="w-5 h-5 rounded-full border border-primary border-b-transparent animate-spin"></div>
          ) : saved ? (
            <Heart className="text-red-500" fill="currentColor" />
          ) : (
            <Heart />
          )}
        </button>
      </div>
      <div className="flex flex-col space-y-0.5">
        <h2 className="text-slate-700 dark:text-gray-400 font-medium w-full truncate mt-2">
          {product.title}
        </h2>
        <p className="text-slate-500 ">{product.brand}</p>
        <div className="flex justify-between">
          <BasicRating rate={4.5} readOnly={true} />
          <p className="text-slate-500 dark:text-gray-300 text-sm">4.7 (208)</p>
        </div>
        <p className="text-primary font-medium dark:text-white text-[18px]">
          {product.price} FCFA
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-3 items-center">
            <button
              className="w-10 h-10 rounded-full flex justify-center items-center text-red-500 text-xl bg-red-300 font-bold"
              onClick={() => {
                if (quantity !== 1) {
                  setQuantity((prev) => prev - 1);
                }
              }}
            >
              -
            </button>
            <span className="text-slate-700 dark:text-gray-300">
              {quantity}
            </span>
            <button
              className="w-10 h-10 rounded-full flex justify-center items-center text-green-500 text-xl bg-emerald-200 font-bold"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
          <div className=""></div>
        </div>
        <button className="bg-primary dark:bg-white text-white dark:text-primary font-medium py-2 rounded-md flex justify-center items-center space-x-2 w-full mx-auto mt-2 group">
          <span>Add to Cart</span>
          <ShoppingCart className="group-hover:scale-115 transition-all duration-300" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
