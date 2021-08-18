import { combineReducers } from 'redux';

// import all reducers here
import businessReducer from './business';
import uiReducer from './ui';

// combine reducers
const reducers = combineReducers({
  business: businessReducer,
  ui: uiReducer,
});

// make the combined reducers available for import
export default reducers;
