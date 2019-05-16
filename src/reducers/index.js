import { combineReducers } from 'redux';
import auth from './auth';
import header from './header';

export default combineReducers({
  user: auth,
  searchValue: header,
});