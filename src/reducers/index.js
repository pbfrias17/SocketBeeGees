import { combineReducers } from 'redux'
import roomReducer from './roomReducer';
import userReducer from './userReducer';

export default combineReducers({
  room: roomReducer,
  user: userReducer
});