import { combineReducers } from 'redux';
import componentData from './graphReducers'

export default combineReducers({
  componentData: componentData,
  // More reducers if there are
  // can go here
});