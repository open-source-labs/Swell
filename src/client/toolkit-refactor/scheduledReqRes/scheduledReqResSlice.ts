/**
 * @file Defines a slice for working with scheduled requests.
 *
 * @todo Figure out if it's safe to merge this with the existing ReqResSlice.
 * This slice only manages two reducers, but we're not sure if there were plans
 * to make this much more different from reqResSlice.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReqRes } from '../../../types';

const initialState: ReqRes[] = [];
const scheduledReqResSlice = createSlice({
  name: 'scheduledReqRes',
  initialState,
  reducers: {
    added(state, action: PayloadAction<ReqRes>) {
      state.push(action.payload);
    },

    cleared() {
      return initialState;
    },
  },
});

export const { added, cleared } = scheduledReqResSlice.actions;
export default scheduledReqResSlice.reducer;

