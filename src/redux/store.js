import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage as the default storage
import userReducer from './userSlice';

const persistConfig = {
  key: 'root', // Key for the persisted state
  storage, // Use localStorage to persist the state
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer, // Use the persisted reducer
  },
});

export const persistor = persistStore(store); // Create the persistor
export default store;