import { useEffect } from "react";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

const App = () => {
  const theme = useSelector((state) => state.ui.theme);
  const { pathname } = useLocation();

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
    <div className="overflow-x-hidden overflow-y-auto min-h-screen">
      <Outlet />
    </div>
  );
};

export default App;
