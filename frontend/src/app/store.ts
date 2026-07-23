import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./features/ui";
import userSlice from "./features/user";
import authApi from "./services/auth";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    ui: uiSlice,
    [authApi.reducerPath]: authApi.reducer,
    user: userSlice,
  },
  middleware: (currentMiddleware) =>
    currentMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);
export default store;
