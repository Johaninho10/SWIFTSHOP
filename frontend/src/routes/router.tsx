import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import VerifyEmail from "../pages/VerifyEmail";
import ProtectedRoutes from "../pages/ProtectedRoutes";
import WishList from "../pages/WishList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "",
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/wishlist",
            element: <WishList />,
          },
        ],
      },
    ],
  },
]);

export default router;
