import { combineReducers } from 'redux';

import UiReducer from '../toolkit-refactor/ui/uiSlice';
import HistoryReducer from '../toolkit-refactor/history/historySlice';
import GraphPointsReducer from '../toolkit-refactor/graphPoints/graphPointsSlice';
import CollectionsReducer from '../toolkit-refactor/collections/collectionsSlice';
import ReqResReducer from '../toolkit-refactor/reqRes/reqResSlice';
import NewRequestReducer from '../toolkit-refactor/newRequest/newRequestSlice';
import NewRequestFieldsReducer from '../toolkit-refactor/newRequestFields/newRequestFieldsSlice';
import NewRequestOpenApiReducer from '../toolkit-refactor/newRequestOpenApi/newRequestOpenApiSlice';
import IntrospectionDataReducer from '../toolkit-refactor/introspectionData/introspectionDataSlice';
import WarningMessageReducer from '../toolkit-refactor/warningMessage/warningMessageSlice';
import MockServerReducer from '../toolkit-refactor/mockServer/mockServerSlice';

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

