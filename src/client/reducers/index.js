import { combineReducers } from 'redux';

// import all reducers here
import businessReducer from './business';
import uiReducer from './ui';

// combine reducers
const reducers = combineReducers({
  // if we had other reducers, they would go here
  business: businessReducer,
  ui: uiReducer,
});

// make the combined reducers available for import
export default reducers;
