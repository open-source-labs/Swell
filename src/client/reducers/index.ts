import { combineReducers } from 'redux';

// import all reducers here
import businessReducer from './business';
import uiReducer from './ui';

// combine reducers
const reducers = combineReducers({
  business: businessReducer,
  // @ts-expect-error ts-migrate(2322) FIXME: Type '(state: { composerDisplay: string; sidebarAc... Remove this comment to see the full error message
  ui: uiReducer,
});

// make the combined reducers available for import
export default reducers;
