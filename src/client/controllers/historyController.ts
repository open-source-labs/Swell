import format from 'date-fns/format';
import parse from 'date-fns/parse';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../s... Remove this comment to see the full error message
import * as store from '../store';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../a... Remove this comment to see the full error message
import * as actions from '../actions/actions';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../d... Remove this comment to see the full error message
import db from '../db';
import { NewRequestResponseObject } from '../../types';

const historyController = {
  addHistoryToIndexedDb(reqRes: NewRequestResponseObject): void {
    db.table('history')
      .put(reqRes)
      .catch((err: string) => console.log('Error in addToHistory', err));
  },

  deleteHistoryFromIndexedDb(id: string): void {
    db.table('history')
      .delete(id)
      .catch((err: string) => console.log('Error in deleteFromHistory', err));
  },

  clearHistoryFromIndexedDb(): void {
    db.table('history').clear().catch((err: string) => console.log(err));
  },

  getHistory(): void {
    db.table('history')
    .toArray()
    // .then((history: any) => {console.log('history', history); return history;})
      .then((history: NewRequestResponseObject[]) => {
        const historyGroupsObj = history.reduce((groups: Record<string, NewRequestResponseObject[]>, hist: NewRequestResponseObject) => {
          const date = format(hist.createdAt, 'MM/DD/YYYY');
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(hist);
          return groups;
        }, {});
        console.log('historyGroupsObj==>', historyGroupsObj);
        const historyGroupsArr = Object.keys(historyGroupsObj)
          .sort((a, b) => parse(b).valueOf() - parse(a).valueOf()) // 
          .map((date: string) => ({ // this returns an array of objects with the date as the key and the array of history objects as the value
            date,
            history: historyGroupsObj[date].sort(
              (a: NewRequestResponseObject, b: NewRequestResponseObject) => b.createdAt.valueOf() - a.createdAt.valueOf()), 
            }));
        store.default.dispatch(actions.getHistory(historyGroupsArr));
      })
      .catch((err: string) => console.log('Error in getHistory', err));
  },
};


export default historyController;


