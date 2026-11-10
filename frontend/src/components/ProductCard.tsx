import { Link, useNavigate } from "react-router-dom";
import BasicRating from "./BasicRating";
import { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useToggleWishMutation } from "../app/services/products";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import {
  useAddToCartMutation,
  useUpdateCartMutation,
} from "../app/services/cart";
import { Loader } from "lucide-react";
import { setCart } from "../app/features/cart";

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
  const [quantity, setQuantity] = useState<number>(1);
  const [saved, setSaved] = useState<boolean>(product.saved);

  const [addToCart, { isLoading: addToCartLoading }] = useAddToCartMutation();
  const [updateCart, { isLoading: updateCartLoading }] =
    useUpdateCartMutation();

  const [toggleWish, { isLoading }] = useToggleWishMutation();

  const user = useSelector((store: Store) => store.user.user);
  const cart = useSelector((store: Store) => store.cart.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggleWish = async () => {
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

  const handleAddToCart = async () => {
    try {
      const cartItem = cart.find((item) => item.product.id === product.id);

      if (!cartItem) {
        const result = await addToCart({
          productId: product.id,
          quantity,
        }).unwrap();

        if (!result.success) {
          throw new Error(result.message);
        }
        dispatch(setCart([...cart, result.cartItem]));
      } else {
        const result = await updateCart({
          productId: product.id,
          quantity: quantity + cartItem.quantity,
        }).unwrap();

        if (!result.success) {
          throw new Error(result.message);
        }

        let cartCopy = [...cart];

        cartCopy = cartCopy.map((item) => {
          if (item.product.id === cartItem.product.id) {
            return { ...item, quantity: quantity + item.quantity };
          }
          return item;
        });

        dispatch(setCart(cartCopy));
      }

      toast.success("Added to Cart");
    } catch (error) {
      console.log(error);

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
        <Link className="" to={`/product/${product.id}`}>
          <img
            src={product.images[0].url}
            alt="product"
            className="w-full h-35 md:h-45 object-cover group-hover:scale-110 transition-all duration-300"
          />
        </Link>
        <button
          disabled={isLoading}
          className="w-11 h-11 rounded-full bg-white flex justify-center items-center absolute right-2 top-2"
          onClick={handleToggleWish}
        >
          {isLoading ? (
            <div className="w-5 h-5 rounded-full border border-primary border-b-transparent animate-spin"></div>
          ) : user && saved ? (
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
          <BasicRating rate={product.rate} readOnly={true} />
          <p className="text-slate-500 dark:text-gray-300 text-sm">
            {Number(product.rate).toFixed(2)} ({product.reviews})
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
