import { combineReducers } from 'redux';

import UiReducer from './slices/uiSlice';
import HistoryReducer from './slices/historySlice';
import GraphPointsReducer from './slices/graphPointsSlice';
import CollectionsReducer from './slices/collectionsSlice';
import ReqResReducer from './slices/reqResSlice';
import NewRequestReducer from './slices/newRequestSlice';
import NewRequestFieldsReducer from './slices/newRequestFieldsSlice';
import NewRequestOpenApiReducer from './slices/newRequestOpenApiSlice';
import IntrospectionDataReducer from './slices/introspectionDataSlice';
import WarningMessageReducer from './slices/warningMessageSlice';
import MockServerReducer from './slices/mockServerSlice';

// Note: There was previously a currentTab prop in the Redux store; it wasn't
// used anywhere, and there was no info about it other than it was a string. We
// dropped it from the store, but it might make sense to add it back at some
// point
const rootReducer = combineReducers({
  history: HistoryReducer,
  newRequest: NewRequestReducer,
  graphPoints: GraphPointsReducer,
  collections: CollectionsReducer,
  newRequestFields: NewRequestFieldsReducer,
  newRequestOpenApi: NewRequestOpenApiReducer,
  reqRes: ReqResReducer,
  ui: UiReducer,
  introspectionData: IntrospectionDataReducer,
  warningMessage: WarningMessageReducer,
  mockServer: MockServerReducer,
});

export default rootReducer;

