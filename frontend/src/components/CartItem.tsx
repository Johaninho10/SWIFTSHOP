import { motion } from "motion/react";
import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUpdateCartMutation } from "../app/services/cart";
import { useSelector, useDispatch } from "react-redux";
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
  saved: boolean;
  images: Image[];
};

type CartItem = {
  product: Product;
  quantity: number;
  color: string;
};

type Cart = {
  cart: CartItem[];
};

type Store = {
  cart: Cart;
};

const CartItem = (item: CartItem) => {
  const [quantity, setQuantity] = useState<string>(String(item.quantity));
  const [updateCart, { isLoading }] = useUpdateCartMutation();

  const cart = useSelector((store: Store) => store.cart.cart);
  const dispatch = useDispatch();

  const handleUpdateCart = async (qty: number) => {
    try {
      if (qty < 0) {
        throw new Error();
      }
      const result = await updateCart({
        productId: item.product.id,
        quantity: qty,
        color: item.color,
      }).unwrap();

      console.log(result.success);
      

      if (!result.success) {
        throw new Error(result.message);
      }

      let cartCopy = [...cart];

      if (qty === 0) {
        cartCopy = cartCopy.filter(
          (cartItem) =>
            cartItem.product.id !== item.product.id ||
            cartItem.color !== item.color,
        );
        toast.success("Removed from cart");
      } else {
        cartCopy = cartCopy.map((cartItem) => {
          if (
            cartItem.product.id === item.product.id &&
            cartItem.color === item.color
          ) {
            return { ...cartItem, quantity: qty };
          }
          return cartItem;
        });
        toast.success("Cart Updated");
      }
      dispatch(setCart(cartCopy));
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-shadow duration-200"
      key={item.product.id}
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="shrink-0 bg-[#EEF1F8] dark:bg-gray-800 rounded-xl w-24 h-24 md:w-32 md:h-32 flex items-center justify-center overflow-hidden">
          <img
            src={item.product.images[0].url}
            alt={item.product.title}
            className="w-full h-full object-contain p-2"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          {/* Brand */}
          <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-gray-500 font-medium">
            {item.product.brand}
          </p>

          {/* Title */}
          <h2 className="text-sm md:text-base font-semibold text-slate-800 dark:text-gray-100 leading-snug line-clamp-2">
            {item.product.title}
          </h2>

          {/* Price formula + color swatch */}
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-slate-400 dark:text-gray-500">
              {item.product.price.toLocaleString()} FCFA &times; {item.quantity}
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-full ring-2 ring-offset-1 ring-slate-300 dark:ring-gray-600"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </div>

          {/* Total price */}
          <p className="text-base md:text-lg font-bold text-primary dark:text-primary/90 mt-auto">
            {(item.product.price * item.quantity).toLocaleString()} FCFA
          </p>
        </div>
      </div>

      {/* Bottom row: quantity stepper + delete */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-gray-700/60">
        {/* Quantity stepper */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-gray-400 mr-1">
            Qty
          </span>
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-gray-600 overflow-hidden">
            <button
              className="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
              disabled={isLoading || item.quantity === 1}
              onClick={async () => {
                if (item.quantity !== 1) {
                  await handleUpdateCart(item.quantity - 1);
                  setQuantity((prev) => String(Number(prev) - 1));
                }
              }}
            >
              <Minus size={14} />
            </button>

            {isLoading ? (
              <div className="w-9 h-9 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary border-b-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <input
                type="text"
                className="w-10 h-9 text-center text-sm font-medium text-slate-700 dark:text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary transition-all"
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (isNaN(value)) {
                    e.preventDefault();
                  } else {
                    setQuantity(e.target.value);
                  }
                }}
                onBlur={async (e) => {
                  const value = Number(e.target.value);
                  if (value === 0) {
                    setQuantity(item.quantity.toString());
                  } else {
                    if (value !== item.quantity) {
                      await handleUpdateCart(value);
                    }
                  }
                }}
              />
            )}

            <button
              className="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
              disabled={isLoading}
              onClick={async () => {
                await handleUpdateCart(item.quantity + 1);
                setQuantity((prev) => String(Number(prev) + 1));
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Delete button */}
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-40 transition-colors text-xs font-medium"
          disabled={isLoading}
          onClick={async () => await handleUpdateCart(0)}
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
