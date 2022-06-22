import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { $TSFixMe, ReqRes } from '../../../types';
import { format, parseISO } from 'date-fns';

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
    cleared(state): void {
      state = [];
    },

    set(state, action: PayloadAction<HistoryItem[]>): void {
      state = action.payload;
    },

    deleted(state, action: PayloadAction<ReqRes>): void {
      let { createdAt } = action.payload;
      if (typeof createdAt === 'string') {
        createdAt = parseISO(createdAt);
      }

      const deleteDate = format(createdAt, 'MM/dd/yyyy');
      const deleteId = action.payload.id;

      // Note to any new-ish devs: if you're using the .splice method, then 9
      // times out of 10, there's a better way to do the same thing. The only
      // reason why this is being kept as-is is because someone wrote this with
      // no documentation, and we're afraid of making breaking changes
      //
      // .splice is really squirrelly when looping and should be avoided unless
      // you really need it for performance. Even then, there might be more
      // performant methods. Most of the time, it's just hard to
      // read/understand. Here, there's a 99% chance that elements are
      // accidentally being skipped in this loop because forEach assumes that
      // the array being iterated over won't have elements deleted mid-
      // iteration. The problem is, we don't fully know if other parts of the
      // code are compensating for this
      state.forEach((obj, index) => {
        if (obj.date === deleteDate) {
          obj.history = obj.history.filter((hist) => hist.id !== deleteId);
        }

        if (obj.history.length === 0) {
          state.splice(index, 1);
        }
      });
    },
  },
});

export default HistorySlice;

