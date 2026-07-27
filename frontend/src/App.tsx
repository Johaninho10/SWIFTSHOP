import { useEffect } from "react";
import { useSelector, useDispatch} from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { useGetUserQuery } from "./app/services/user";
import { setUser } from "./app/features/user";
import {motion, scale} from "motion/react"

type UI = {
  theme: string
}

type State = {
  ui: UI
}

const App = () => {
  const theme = useSelector((state: State) => state.ui.theme);
  const { pathname } = useLocation();

  const {data, isLoading} = useGetUserQuery(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if(data){
        if(data.success) {
        dispatch(setUser(data.user))
        localStorage.setItem("user", JSON.stringify(data.user))
      }
    }
  }, [data])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);
  return (
    isLoading ? <div className="w-screen h-screen flex justify-center items-center bg-secondary dark:bg-gray-800">
      <motion.img src={theme === "dark" ? "/logo-white.png" : "/logo.png"} alt="logo" className="w-25"
      animate={{scale: [1, 1.1, 1]}}
      transition={{duration: 1, repeat: Infinity}}/>
    </div> : <div className="overflow-x-hidden overflow-y-auto min-h-screen">
      <Outlet />
    </div>
  );
};

export default App;
