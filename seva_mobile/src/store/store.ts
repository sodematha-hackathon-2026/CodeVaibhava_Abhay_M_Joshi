import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import cacheReducer from "./slices/cacheSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  app: appReducer,
  cache: cacheReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["app", "cache"], };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,     }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
