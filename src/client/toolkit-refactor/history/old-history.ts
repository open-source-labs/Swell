/**
 * @file Defines all functionality and types needed for reducing the history
 * array property of the Redux store.
 */

import * as actionTypes from '../../actions(deprecated)/actionTypes';
import { initialState, StateInterface } from '../_temp/business-v2';
import { format, parseISO } from 'date-fns';

/**
 * Defines all actions that a history array needs to respond to.
 */
type HistoryAction =
  | { type: typeof actionTypes.CLEAR_HISTORY }
  | { type: typeof actionTypes.GET_HISTORY; payload: StateInterface['history'] }
  | {
      type: typeof actionTypes.DELETE_HISTORY;

      // Since history is a non-tuple array, indexing at 0 just grabs the type
      // of any element in the array, not the element specifically at index 0
      payload: StateInterface['history'][0];
    };

/**
 * Implements all logic for reducing the history array in the Redux store.
 */
export default function historyReducer(
  history: StateInterface['history'] = initialState.history,
  action: HistoryAction
): StateInterface['history'] {
  switch (action.type) {
    case 'GET_HISTORY': {
      return action.payload;
    }

    case 'CLEAR_HISTORY': {
      return [];
    }

    case 'DELETE_HISTORY': {
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
      // .splice is really squirrelly and should be avoided unless you really
      // need it for performance. Even then, there might be more performant
      // methods. Most of the time, it's just hard to read/understand. Here,
      // there's a 99% chance that elements are accidentally being skipped in
      // this loop because forEach assumes that the array being iterated over
      // won't have elements deleted mid-iteration. The problem is, we don't
      // fully know if other parts of the code are compensating for this
      const newHistory = [...history];
      newHistory.forEach((obj, index) => {
        if (obj.date === deleteDate) {
          obj.history = obj.history.filter((hist) => hist.id !== deleteId);
        }

        if (obj.history.length === 0) {
          newHistory.splice(index, 1);
        }
      });

      return newHistory;
    }

    default: {
      return history;
    }
  }
}

