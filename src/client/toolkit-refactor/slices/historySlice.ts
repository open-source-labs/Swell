import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reqResItemAdded } from './reqResSlice';

import { type $NotUsed, type ReqRes } from '~/types';
import { format, parseISO } from 'date-fns';

export type HistoryItem = {
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
    //Before toolkit conversion was CLEAR_HISTORY or clearHistory
    historyCleared(): HistoryItem[] {
      return [];
    },

    //Before toolkit conversion was GET_HISTORY or getHistory
    historySet<HI extends HistoryItem>(
      _state: $NotUsed,
      action: PayloadAction<HI[]>
    ): HI[] {
      return action.payload;
    },

    //Before toolkit convserion was DELETE_HISTORY or deleteFromHistory
    historyDeleted(state, action: PayloadAction<ReqRes>) {
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
      // const updatedHistoryItems: HistoryItem[] = [];

      /** @todo Refactor this to use Immer-style syntax */
      const newHistory: HistoryItem[] = [];
      for (const historyObj of state) {
        let currentObj = historyObj;
        if (currentObj.date === deleteDate) {
          currentObj = {
            ...currentObj,
            history: currentObj.history.filter((hist) => hist.id !== deleteId),
          };
        }

        if (currentObj.history.length > 0) {
          newHistory.push(currentObj);
        }
      }

      return newHistory;
    },
  },

  extraReducers: (builder) => {
    //Before toolkit conversion was REQRES_ADD or reqresAdd
    builder.addCase(reqResItemAdded, (state, action) => {
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

export const { historyCleared, historySet, historyDeleted } =
  HistorySlice.actions;
export default HistorySlice.reducer;

