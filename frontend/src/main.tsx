import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";
import { Provider } from "react-redux";
import store from "./app/store.ts";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ToastContainer autoClose={2000} pauseOnHover={true} closeOnClick={true} />
    <RouterProvider router={router} />
  </Provider>,
);
