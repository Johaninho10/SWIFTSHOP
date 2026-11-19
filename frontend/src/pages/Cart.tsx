import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, ShoppingBag } from "lucide-react";

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
  color: string;
};

type Cart = {
  cart: CartItems[];
};

type Store = {
  cart: Cart;
};

const Cart = () => {
  const cart = useSelector((store: Store) => store.cart.cart);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0,
  );
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 pt-[10vh]">
      <Navbar />

      {cart.length === 0 ? (
        /* ── Empty State ── */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6">
            <ShoppingCart size={40} className="text-primary dark:text-primary/80" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-2">
            Your cart is empty
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-xs">
            Looks like you haven't added anything yet. Start shopping and find
            something you'll love!
          </p>
          <button
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 active:scale-95 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>
        </div>
      ) : (
        /* ── Cart with items ── */
        <div className="flex-1 px-4 md:px-[5%] lg:px-[10%] py-8">
          {/* Page header */}
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100">
              Your Cart
            </h1>
            <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-primary text-white text-xs font-semibold">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr] gap-8 items-start">
            {/* ── Cart items list ── */}
            <div className="flex flex-col space-y-4">
              {cart.map((item, index) => (
                <CartItem {...item} key={index} />
              ))}
            </div>

            {/* ── Order Summary ── */}
            <div className="rounded-2xl border border-slate-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-sm sticky top-6 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 dark:border-gray-700/60 flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary" />
                <h2 className="text-base font-semibold text-slate-700 dark:text-gray-200">
                  Order Summary
                </h2>
              </div>

              {/* Line items */}
              <div className="px-5 py-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                    {subtotal.toLocaleString()} FCFA
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    Service Fee (10%)
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                    {serviceFee.toLocaleString(undefined, { maximumFractionDigits: 0 })} FCFA
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="px-5 py-4 border-t border-slate-100 dark:border-gray-700/60 flex justify-between items-center">
                <p className="font-semibold text-slate-800 dark:text-gray-100">
                  Total
                </p>
                <p className="text-xl font-bold text-primary dark:text-primary/90">
                  {total.toLocaleString(undefined, { maximumFractionDigits: 0 })} FCFA
                </p>
              </div>

              {/* Checkout button */}
              <div className="px-5 pb-5">
                <button className="w-full bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                  <ShoppingBag size={18} />
                  Proceed to Checkout
                </button>
                <button
                  className="w-full mt-3 text-sm text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary/80 py-2 transition-colors flex items-center justify-center gap-1.5"
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft size={14} />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
