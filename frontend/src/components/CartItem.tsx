import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
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

type CartItems = {
  product: Product;
  quantity: number;
};

type Cart = {
  cart: CartItems[];
};

type Store = {
  cart: Cart;
};

const CartItem = (item: CartItems) => {
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
      }).unwrap();

      if (!result.success) {
        throw new Error(result.message);
      }

      let cartCopy = [...cart];

      if (qty === 0) {
        cartCopy = cartCopy.filter(
          (cartItem) => cartItem.product.id !== item.product.id,
        );
        toast.success("Removed from cart");
      } else {
        cartCopy = cartCopy.map((cartItem) => {
          if (cartItem.product.id === item.product.id) {
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
      className="shadow-[0px_0px_5px_rgba(0,0,0,0.2)] dark:shadow-[0px_0px_10px_rgba(0,0,0,0.2)] rounded-lg py-2 px-4 bg-white dark:bg-gray-800"
      key={item.product.id}
    >
      <div className="flex flex-col md:flex-row space-y-1 md:space-y-2 gap-x-2">
        <div className="bg-[#E6E9F2] w-20 md:w-32 h-20 md:h-32 mx-auto rounded-lg">
          <img
            src={item.product.images[0].url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col md:justify-between flex-1">
          <h2 className="md:text-xl font-medium text-slate-700 dark:text-gray-300 truncate">
            {item.product.title}
          </h2>
          <p className="text-slate-600 max-md:text-sm dark:text-gray-400">
            {item.product.brand}
          </p>
          <p className="text-slate-500 dark:text-gray-300 w-full flex justify-between">
            {item.product.price} * {item.quantity}{" "}
            <span className="text-primary text-xl font-medium">
              {item.product.price * item.quantity} FCFA
            </span>
          </p>
          <div className="flex justify-between w-full items-center">
            <div className="flex space-x-2 items-center">
              <p className="text-slate-700 dark:text-white">Quantity:</p>
              <div className="flex space-x-4 items-center">
                <button
                  className="w-8 h-8 rounded-full bg-red-300 text-red-500 flex justify-center items-center text-2xl"
                  disabled={isLoading}
                  onClick={async () => {
                    if (item.quantity !== 1) {
                      await handleUpdateCart(item.quantity - 1);
                      setQuantity((prev) => String(Number(prev) - 1));
                    }
                  }}
                >
                  -
                </button>
                {isLoading ? (
                  <div className="w-5 h-5 border border-primary border-b-transparent rounded-full animate-spin"></div>
                ) : (
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
                  className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-500 flex justify-center items-center text-2xl"
                  disabled={isLoading}
                  onClick={async () => {
                    await handleUpdateCart(item.quantity + 1);
                    setQuantity((prev) => String(Number(prev) + 1));
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <button
                className="px-2 py-2 rounded-md bg-red-500"
                disabled={isLoading}
                onClick={async () => await handleUpdateCart(0)}
              >
                <Trash2 className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
