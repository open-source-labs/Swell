import { combineReducers } from 'redux';
import UiReducer from '../toolkit-refactor/ui/uiSlice';

import HistoryReducer from '../toolkit-refactor/history/historySlice';
import GraphPointsReducer from '../toolkit-refactor/graphPoints/graphPointsSlice';
import CollectionsReducer from '../toolkit-refactor/collections/collectionsSlice';

import ReqResReducer from '../toolkit-refactor/reqRes/reqResSlice';
import NewRequestReducer from '../toolkit-refactor/newRequest/newRequestSlice';
import NewRequestFieldsReducer from '../toolkit-refactor/newRequestFields/newRequestFieldsSlice';
import ScheduledReqResReducer from '../toolkit-refactor/scheduledReqRes/scheduledReqResSlice';
import NewRequestOpenApiReducer from '../toolkit-refactor/newRequestOpenApi/newRequestOpenApiSlice';

const rootReducer = combineReducers({
  history: HistoryReducer,
  newRequest: NewRequestReducer,
  scheduledReqRes: ScheduledReqResReducer,
  graphPoints: GraphPointsReducer,
  collections: CollectionsReducer,
  newRequestFields: NewRequestFieldsReducer,
  newRequestOpenApi: NewRequestOpenApiReducer,
  reqRes: ReqResReducer,
  ui: UiReducer,
});

export default rootReducer;

