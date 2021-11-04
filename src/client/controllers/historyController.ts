import format from 'date-fns/format';
import parse from 'date-fns/parse';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../s... Remove this comment to see the full error message
import * as store from '../store';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../a... Remove this comment to see the full error message
import * as actions from '../actions/actions';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../d... Remove this comment to see the full error message
import db from '../db';
import { NewRequestResponseObject, HistoryTab } from '../../types';

const historyController = {
  addHistoryToIndexedDb(reqRes: NewRequestResponseObject): void {
    db.history
      .put(reqRes)
      .catch((err: string) => console.log('Error in addToHistory', err));
  },

  deleteHistoryFromIndexedDb(id: any) {
    db.history
      .delete(id)
      .catch((err: string) => console.log('Error in deleteFromHistory', err));
  },

  clearHistoryFromIndexedDb() {
    db.history.clear().catch((err: string) => console.log(err));
  },

  getHistory() {
    db.table('history')
      .toArray()
      .then((history: any) => {
        const historyGroupsObj = history.reduce((groups: any, hist: any) => {
          const date = format(hist.created_at, 'MM/DD/YYYY');
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(hist);
          return groups;
        }, {});
        console.log('historyGroupsObj==>', historyGroupsObj);
        const historyGroupsArr = Object.keys(historyGroupsObj)
          // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
          .sort((a, b) => parse(b) - parse(a))
          .map((date) => ({
            date,
            history: historyGroupsObj[date].sort(
              (a: any, b: any) => b.created_at - a.created_at
            ),
          }));
        store.default.dispatch(actions.getHistory(historyGroupsArr));
      })
      .catch((err: any) => console.log('Error in getHistory', err));
  },
};

export default historyController;
