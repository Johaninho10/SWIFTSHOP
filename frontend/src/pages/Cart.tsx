import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";

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

const Cart = () => {
  const cart = useSelector((store: Store) => store.cart.cart);
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {cart.length === 0 ? (
        <div className="px-2.5 md:px-[5%] lg:px-[10%] pt-10 flex-1 dark:bg-gray-800">
          <h1 className="text-primary dark:text-primary/80 font-medium text-xl">
            You haven't add a product to your cart yet!
          </h1>

          <button className="bg-primary py-3 px-2 rounded-md text-white mt-4" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr] justify-between pt-10 px-2.5 md:px-[5%] lg:px-[10%] bg-gray-100 dark:bg-gray-800 transition-all duration-300  flex-1 gap-x-10">
          <div className="flex flex-col space-y-5">
            {cart.map((item) => (
              <CartItem {...item} />
            ))}
          </div>
          <div className="shadow-[0px_0px_20px_rgba(0,0,0,0.2)] rounded-lg py-2 px-4 self-start">
            <h1 className="text-slate-700 dark:text-gray-300 text-xl font-medium pb-6 border-b border-slate-200 dark:border-slate-600">
              Order Summary
            </h1>
            <div className="flex flex-col space-y-1 mt-4 pb-6 border-b border-slate-200 dark:border-slate-600">
              <div className="flex justify-between w-full items-center">
                <p className="text-slate-600 dark:text-gray-400">Subtotal:</p>
                <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">
                  {cart
                    .reduce(
                      (acc, item) => acc + item.quantity * item.product.price,
                      0,
                    )
                    .toFixed(0)}{" "}
                  FCFA
                </p>
              </div>
              <div className="flex justify-between w-full items-center">
                <p className="text-slate-600 dark:text-gray-400">
                  Service Fee (10%):
                </p>
                <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">
                  {(
                    cart.reduce(
                      (acc, item) => acc + item.quantity * item.product.price,
                      0,
                    ) * 0.1
                  ).toFixed(0)}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <h1 className="font-medium text-2xl text-slate-700 dark:text-gray-100">
                Total
              </h1>
              <p className="text-xl text-primary font-medium">
                {(
                  cart.reduce(
                    (acc, item) => acc + item.quantity * item.product.price,
                    0,
                  ) +
                  Number(
                    cart.reduce(
                      (acc, item) => acc + item.quantity * item.product.price,
                      0,
                    ) * 0.1,
                  )
                ).toFixed(0)}{" "}
                FCFA
              </p>
            </div>
            <button className="bg-primary text-white py-2 rounded-md w-full mt-4">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
