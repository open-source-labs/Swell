import { format, parse } from 'date-fns';
import * as store from '../store';
import * as actions from '../actions/actions';
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


