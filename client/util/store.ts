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

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store