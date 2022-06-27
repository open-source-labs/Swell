/**
 * @file Defines the Redux Toolkit slice for working with Request/Response
 * arrays and associated values.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReqRes } from '../../../types';

type ReqResStore = {
  reqResArray: ReqRes[];
  currentResponse: {
    request: {
      network: string;
    };
  };
};

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
    replaced(state, action: PayloadAction<ReqRes[]>) {
      state.reqResArray = action.payload;
    },

    cleared(state, _unusedAction: PayloadAction<void>) {
      state.reqResArray = [];
      state.currentResponse.request.network = '';
    },

    itemAdded(state, action: PayloadAction<ReqRes>) {
      state.reqResArray.push(action.payload);
    },

    itemDeleted(state, action: PayloadAction<ReqRes>) {
      const deletionIndex = state.reqResArray.findIndex(
        (reqRes) => reqRes.id === action.payload.id
      );

      if (deletionIndex > -1) {
        state.reqResArray.splice(deletionIndex, 1);
      }
    },

    updated(state, action: PayloadAction<ReqRes>) {
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

    responseDataSaved(
      state,
      action: PayloadAction<ReqResStore['currentResponse']>
    ) {
      state.currentResponse = action.payload;
    },
  },
});

export const {
  replaced,
  cleared,
  itemAdded,
  itemDeleted,
  updated,
  responseDataSaved,
} = reqResSlice.actions;
export default reqResSlice.reducer;

