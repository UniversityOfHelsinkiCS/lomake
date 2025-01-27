import { configureStore } from '@reduxjs/toolkit';
import { handleRequest } from './apiConnection';
import webSocketMiddleware from './webSocket';
import combinedReducers from './redux';

export interface State {
  keyData: {
    data: {
      [key: string]: any
    }
  }
}

const store = configureStore({
  reducer: combinedReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(webSocketMiddleware, handleRequest),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store