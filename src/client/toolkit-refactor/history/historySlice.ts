import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { itemAdded } from '../reqRes/reqResSlice';

import { $NotUsed, ReqRes } from '../../../types';
import { format, parseISO } from 'date-fns';
import { WritableDraft } from 'immer/dist/internal';
import produce from 'immer';

type HistoryItem = {
  /**
   * A date for a specific history item. Stored as string so that value is fully
   * JSON-serializable; format seems to be MM/dd/yyyy
   */
  date: string;
  history: ReqRes[];
};

const initialState: HistoryItem[] = [];

const HistorySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    // Previously CLEAR_HISTORY or clearHistory
    cleared(): HistoryItem[] {
      return [];
    },

    // Previously GET_HISTORY or getHistory
    set<HI extends HistoryItem>(
      _state: $NotUsed,
      action: PayloadAction<HI[]>
    ): HI[] {
      return action.payload;
    },

    // Previously DELETE_HISTORY or deleteHistory
    deleted(
      state,
      action: PayloadAction<ReqRes>
    ): WritableDraft<HistoryItem>[] {
      let { createdAt } = action.payload;
      if (typeof createdAt === 'string') {
        createdAt = parseISO(createdAt);
      }

      const deleteDate = format(createdAt, 'MM/dd/yyyy');
      const deleteId = action.payload.id;

      // Note: The previous version of the code used mid-looping splicing to
      // remove elements. This can cause elements to be skipped because forEach
      // and other array methods expect the array to stay the same size
      // throughout
      return produce<HistoryItem[]>([], (draft) => {
        for (const historyObj of state) {
          if (historyObj.date === deleteDate) {
            historyObj.history = historyObj.history.filter(
              (hist) => hist.id !== deleteId
            );
          }

          if (historyObj.history.length > 0) {
            draft.push(historyObj);
          }
        }
      });
    },
  },

  extraReducers: (builder) => {
    // Case was previously REQRES_ADD or reqresAdd
    builder.addCase(itemAdded, (state, action) => {
      const formattedDate = format(action.payload.createdAt, 'MM/dd/yyyy');
      let updated = false;

      for (const historyObj of state) {
        if (historyObj.date === formattedDate) {
          historyObj.history.unshift(action.payload);
          updated = true;
        }
      }

      if (!updated) {
        state.unshift({
          date: formattedDate,
          history: [action.payload],
        });
      }
    });
  },
});

export const { cleared, set, deleted } = HistorySlice.actions;
export default HistorySlice.reducer;

