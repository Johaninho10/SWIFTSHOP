import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  Sun,
  Menu,
  Moon,
  User,
  RotateCcwIcon,
  LogOut,
  CircleUserRound,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../app/features/ui";
import { useSignOutMutation } from "../app/services/auth";
import toast from "react-hot-toast";
import { setUser } from "../app/features/user";
import { useState } from "react";
import { setCart } from "../app/features/cart";

type UI = {
  theme: string;
};

type User = {
  user: {
    firstname: string;
    lastname: string;
  };
};

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
};

type Cart = {
  cart: CartItem[];
};

type State = {
  ui: UI;
  user: User;
  cart: Cart;
};

const Navbar = () => {
  const theme = useSelector((state: State) => state?.ui?.theme);
  const user = useSelector((state: State) => state?.user?.user);
  const cart = useSelector((state: State) => state.cart.cart);
  const cartQuantity =
    cart.length === 0 ? 0 : cart.reduce((acc, item) => acc + item.quantity, 0);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signOut] = useSignOutMutation();

  const handleSignOut = async () => {
    try {
      const result = await signOut({}).unwrap();
      if (result.success) {
        toast.success(result.message);
        localStorage.removeItem("user");
        dispatch(setUser(null));
        dispatch(setCart([]));
        if (showSidebar) {
          setShowSidebar(false);
        }
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown Error");
      }
    }
  };

  return (
    <header className="h-[10vh] fixed z-10 top-0 left-0 right-0">
      <div className="flex justify-between items-center px-2.5 h-full md:px-[5%] lg:px-[10%] border-b border-slate-300 dark:border-slate-500 bg-white dark:bg-gray-950 transition-all duration-300">
        <Link to={"/"}>
          <img
            src={theme === "dark" ? "/logo-white.png" : "/logo.png"}
            alt="logo"
            className="w-10"
          />
        </Link>

        <div className="flex items-center space-x-3">
          <button
            className="w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all cursor-pointer"
            onClick={() => navigate("/search")}
            title="Search"
          >
            <Search className="" />
          </button>

          <button
            className="w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all cursor-pointer"
            onClick={() => {
              if (!user) {
                navigate("/signin");
              } else {
                navigate("/wishlist");
              }
            }}
          >
            <Heart className="" />
          </button>

          <button
            className="w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="" />
            <div className="absolute bg-red-500 w-6 h-6 flex justify-center items-center rounded-full -top-1 -right-1 text-white text-xs">
              {cartQuantity}
            </div>
          </button>

          <button
            className="w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all cursor-pointer"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "dark" ? <Moon /> : <Sun />}
          </button>
          {user && (
            <button
              className="sm:hidden w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all cursor-pointer"
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="" />
            </button>
          )}
          {user ? (
            <div className="dropdown dropdown-start hidden sm:flex relative">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 w-12 h-12 rounded-full flex justify-center items-center bg-primary text-white border-0 text-xl"
              >
                {user.firstname[0].toUpperCase()}
                {user.lastname[0].toUpperCase()}
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-white dark:bg-gray-800 rounded-md py-4 w-52 shadow-[0px_0px_10px_rgba(0,0,0,0.2)] absolute top-full right-1/2 z-2"
              >
                <li className="hover:bg-slate-200/60 dark:hover:bg-gray-600 rounded-md text-[16px] py-1">
                  <a className="text-slate-700 dark:text-gray-200 font-medium flex space-x-2 items-center">
                    <CircleUserRound />
                    <span>Profile</span>
                  </a>
                </li>
                <li className="hover:bg-slate-200/60 dark:hover:bg-gray-600 rounded-md text-[16px] py-1">
                  <a className="text-slate-700 dark:text-gray-200 font-medium flex space-x-2 items-center">
                    <RotateCcwIcon />
                    <span>Order History</span>
                  </a>
                </li>
                <li
                  className="hover:bg-slate-200/60 dark:hover:bg-gray-600 rounded-md text-[16px] py-1 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <a className="text-slate-700 dark:text-gray-200 font-medium flex space-x-2 items-center">
                    <LogOut />
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="bg-primary rounded-lg py-3 px-4 flex justify-center items-center space-x-2 text-white transition-all cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              <span className="text-sm">Sign In</span>
            </button>
          )}
        </div>
      </div>

      <div
        className={`${showSidebar ? "max-sm:w-screen sm:w-0 sm:overflow-hidden" : "w-0 overflow-hidden"} fixed top-0 h-screen transition-all duration-300 z-1000`}
      >
        <div
          className="bg-black/60 backdrop-blur-sm w-full h-full"
          onClick={() => setShowSidebar(false)}
        ></div>
        <div
          className={`bg-white dark:bg-gray-800 absolute top-0 left-0 bottom-0 pt-10 px-4 transition-all ${showSidebar ? "w-60" : "w-0 overflow-hidden"}`}
        >
          {user ? (
            <div className="bg-primary text-white w-15 h-15 rounded-full flex justify-center items-center">
              {user.firstname[0].toUpperCase()}
            </div>
          ) : (
            <img
              src={theme === "dark" ? "/logo-white.png" : "logo.png"}
              alt="logo"
              className="w-15"
            />
          )}
          <div className="mt-10 flex flex-col space-y-2">
            <button className="py-2 text-start px-2 rounded-md hover:bg-primary hover:text-white flex items-center space-x-2 group">
              <User className="text-slate-600 dark:text-white w-5 h-5 group-hover:text-white" />
              <span className="text-[16px] text-slate-700 group-hover:text-white dark:text-white">
                Profile
              </span>
            </button>
            <button className="py-2 text-start px-2 rounded-md hover:bg-primary hover:text-white flex items-center space-x-2 group">
              <RotateCcwIcon className="text-slate-600 dark:text-white w-5 h-5 group-hover:text-white" />
              <span className="text-[16px] text-slate-700 group-hover:text-white dark:text-white">
                Order History
              </span>
            </button>
            <button
              className="py-2 text-start px-2 rounded-md hover:bg-primary hover:text-white flex items-center space-x-2 group"
              onClick={handleSignOut}
            >
              <LogOut className="text-slate-600 dark:text-white w-5 h-5 group-hover:text-white" />
              <span className="text-[16px] text-slate-700 group-hover:text-white dark:text-white">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
