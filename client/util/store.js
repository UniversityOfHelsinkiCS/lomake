/* eslint-disable import/no-cycle */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { handleRequest } from './apiConnection'
import webSocketMiddleware from './webSocket'
import combinedReducers from './redux'

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  combinedReducers,
  composeEnhancers(applyMiddleware(thunk, webSocketMiddleware, handleRequest)),
)

export default store
