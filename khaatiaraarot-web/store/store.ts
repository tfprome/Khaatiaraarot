// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "@/store/authSlice";
// import cartReducer from "@/store/cartSlice";

// import {
//   persistStore,
//   persistReducer,
// } from "redux-persist";

// import storage from "redux-persist/lib/storage";

// const authPersistConfig = {
//   key: "auth",
//   storage,
// };

// const persistedAuthReducer = persistReducer(
//   authPersistConfig,
//   authReducer
// );

// export const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer,
//     cart: cartReducer
//   },
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import cartReducer from "@/store/cartSlice";

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(
  persistConfig,
  authReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
     cart: cartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;