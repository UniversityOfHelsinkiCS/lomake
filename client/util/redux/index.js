import { combineReducers } from 'redux'

import form from './formReducer'
import room from './roomReducer'

export default combineReducers({
  form,
  room
})
