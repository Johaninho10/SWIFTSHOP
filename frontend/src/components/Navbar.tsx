import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  Sun,
  Menu,
  Moon,
  LogIn,
  User,
  RotateCcwIcon,
  LogOut,
  CircleUserRound,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../app/features/ui";
import { useSignOutMutation } from "../app/services/auth";
import { toast } from "react-toastify";
import { setUser } from "../app/features/user";
import { useState } from "react";

type UI = {
  theme: string;
};

type State = {
  ui: UI;
};

const Navbar = () => {
  const theme = useSelector((state: State) => state?.ui?.theme);
  const user = useSelector((state: State) => state?.user?.user);
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
    <header className="">
      <div className="flex justify-between items-center px-2.5 md:px-[5%] lg:px-[10%] border-b border-slate-300 dark:border-slate-500 bg-secondary dark:bg-gray-800 transition-all duration-300">
        <Link to={"/"}>
          <img
            src={theme === "dark" ? "/logo-white.png" : "/logo.png"}
            alt="logo"
            className="w-15"
          />
        </Link>

        <div className="relative hidden sm:block">
          <input
            type="text"
            className="py-2 pl-11 border border-slate-400 dark:bg-slate-700/80 bg-[#F2F3FE] text-slate-800 dark:text-white rounded-lg  w-85 md:w-90 lg:w-100 focus:ring-1 focus:ring-primary transition-all duration-300"
            placeholder="Search a product..."
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 dark:text-white" />
        </div>

        <div className="flex items-center space-x-3">
          <button className="w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all">
            <Search className="" />
          </button>
          {user && (
            <button className="w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all">
              <Heart className="" />
            </button>
          )}

          <button className="w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all relative">
            <ShoppingCart className="" />
            <div className="absolute bg-red-500 w-5 h-5 flex justify-center items-center rounded-full -top-1 -right-1 text-white">
              3
            </div>
          </button>

          <button
            className="w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "dark" ? <Moon /> : <Sun />}
          </button>
          <button
            className="sm:hidden w-10 h-10 rounded-full hover:bg-primary/80 dark:hover:bg-white flex justify-center items-center text-slate-700 dark:text-white hover:text-white dark:hover:text-primary transition-all"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="" />
          </button>
          {user ? (
            <div className="dropdown dropdown-start hidden sm:flex relative">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 w-12 h-12 rounded-full flex justify-center items-center bg-primary text-white border-0 text-xl"
              >
                {user.firstname[0].toUpperCase()}
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-white dark:bg-gray-800 rounded-md z-1 py-4 w-52 shadow-[0px_0px_10px_rgba(0,0,0,0.2)] absolute top-full right-1/2"
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
                  className="hover:bg-slate-200/60 dark:hover:bg-gray-600 rounded-md text-[16px] py-1"
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
              className="bg-primary dark:bg-white  rounded-lg py-2 px-2 flex justify-center items-center space-x-2 text-white dark:text-primary  transition-all"
              onClick={() => navigate("/signin")}
            >
              <span className="">Sign In</span>
              <LogIn className="" />
            </button>
          )}
        </div>
      </div>

      <div
        className={`${showSidebar ? "max-sm:w-screen sm:w-0 sm:overflow-hidden" : "w-0 overflow-hidden"} fixed top-0 h-screen transition-all duration-300 z-1000`}
      >
        <div
          className="bg-black/60 w-full h-full"
          onClick={() => setShowSidebar(false)}
        ></div>
        <div className="bg-white dark:bg-gray-800 absolute top-0 left-0 bottom-0 pt-10 px-4 w-60">
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
