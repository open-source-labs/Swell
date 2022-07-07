/**
 * @file Defines the Redux Toolkit slice for working with Request/Response
 * arrays and associated values.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HttpRequest, ReqRes } from '../../../types';

type ReqResStore = {
  reqResArray: ReqRes[];
  currentResponse: {
    request: {
      network: string;
    };
  };
};

const initialState2: HttpRequest = {};

const initialState: ReqResStore = {
  reqResArray: [],
  currentResponse: {
    request: {
      network: '',
    },
  },
};

// export const reqResItemAdded = createAction('reqResItemAdded');

const reqResSlice = createSlice({
  name: 'reqRes',
  initialState,
  reducers: {
    /**
     * So far, this mainly seems to be used for both collections being converted
     * to a new ReqRes array, or for a request having its checkboxes updated
     * and/or being minimized
     */
    //previously both COLLECTION_TO_REQRES/collectionToReqRes
    // AND SET_CHECKS_AND_MINIS/setChecksAndMinis
    reqResReplaced(state, action: PayloadAction<ReqRes[]>) {
      state.reqResArray = action.payload;
    },

    //previously was REQRES_CLEAR or reqResClear
    reqResCleared(state, _unusedAction: PayloadAction<void>) {
      state.reqResArray = [];
      state.currentResponse.request.network = '';
    },

    //previously was REQRES_ADD or reqResAdd
    reqResItemAdded(state, action: PayloadAction<ReqRes>) {
      state.reqResArray.push(action.payload);
    },

    //previously was REQRES_DELETE or reqResDelete
    reqResItemDeleted(state, action: PayloadAction<ReqRes>) {
      const deletionIndex = state.reqResArray.findIndex(
        (reqRes) => reqRes.id === action.payload.id
      );

      if (deletionIndex > -1) {
        state.reqResArray.splice(deletionIndex, 1);
      }
    },

    //previously was REQRES_UPDATE or reqResUpdate
    reqResUpdated(state, action: PayloadAction<ReqRes>) {
      const updateIndex = state.reqResArray.findIndex(
        (reqRes) => reqRes.id === action.payload.id
      );

      if (updateIndex > -1) {
        const prevReqRes = state.reqResArray[updateIndex];
        state.reqResArray[updateIndex] = {
          ...action.payload,
          checked: prevReqRes.checked,
          minimized: prevReqRes.minimized,
        };
      }
    },

    //previously was SAVE_CURRENT_RESPONSE_DATA or saveCurrentResponseData
    responseDataSaved(
      state,
      action: PayloadAction<ReqResStore['currentResponse']>
    ) {
      state.currentResponse = action.payload;
    },
  },
});

export const {
  reqResReplaced,
  reqResCleared,
  reqResItemAdded,
  reqResItemDeleted,
  reqResUpdated,
  responseDataSaved,
} = reqResSlice.actions;
export default reqResSlice.reducer;

