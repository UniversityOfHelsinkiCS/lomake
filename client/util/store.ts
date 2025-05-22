import { configureStore } from '@reduxjs/toolkit';
import { handleRequest } from './apiConnection';
import webSocketMiddleware from './webSocket';
import combinedReducers from './redux';

const store = configureStore({
  reducer: combinedReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(webSocketMiddleware, handleRequest),
  devTools: process.env.NODE_ENV !== 'production',
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export default store
