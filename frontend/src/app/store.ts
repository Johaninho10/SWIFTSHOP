import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./features/ui";
import userSlice from "./features/user";
import cartSlice from "./features/cart";
import authApi from "./services/auth";
import userApi from "./services/user";
import categoriesApi from "./services/categories";
import productsApi from "./services/products";
import cartApi from "./services/cart";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    ui: uiSlice,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    user: userSlice,
    cart: cartSlice,
  },
  middleware: (currentMiddleware) =>
    currentMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      categoriesApi.middleware,
      productsApi.middleware,
      cartApi.middleware,
    ),
});

setupListeners(store.dispatch);
export default store;
