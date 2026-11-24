import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";
import { Provider } from "react-redux";
import store from "./app/store.ts";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ToastContainer autoClose={2000} pauseOnHover={true} closeOnClick={true} />
    <Toaster />
    <RouterProvider router={router} />
  </Provider>,
);
