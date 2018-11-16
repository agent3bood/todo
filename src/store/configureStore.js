import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers";
const persistConfig = {
  key: "root",
  storage
};
const initialState = {
  todos: []
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, initialState);
export const persistor = persistStore(store);
