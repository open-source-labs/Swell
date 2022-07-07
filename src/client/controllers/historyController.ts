import { format, parse } from 'date-fns';
import db from '../db';
import { ReqRes } from '../../types';

import { appDispatch } from '../toolkit-refactor/store';
import { historySet } from '../toolkit-refactor/history/historySlice';

const historyController = {
  addHistoryToIndexedDb(reqRes: ReqRes): void {
    db.table('history')
      .put(reqRes)
      .catch((err: string) =>
        console.log('Error in addHistoryToIndexedDb', err)
      );
  },

  deleteHistoryFromIndexedDb(id: string): void {
    db.table('history')
      .delete(id)
      .catch((err: string) => console.log('Error in deleteFromHistory', err));
  },

  clearHistoryFromIndexedDb(): void {
    db.table('history')
      .clear()
      .catch((err: string) => console.log(err));
  },

  async getHistory(): Promise<void> {
    try {
      const history: ReqRes[] = await db.table('history').toArray();
      const historyGroupsObj = history.reduce(
        (groups: Record<string, ReqRes[]>, hist: ReqRes) => {
          const date = format(hist.createdAt, 'MM/dd/yyyy');
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(hist);
          return groups;
        },
        {}
      );
      const historyGroupsArr = Object.keys(historyGroupsObj)
        .sort(
          (a, b) =>
            parse(b, 'MM/dd/yyyy', new Date()).valueOf() -
            parse(a, 'MM/dd/yyyy', new Date()).valueOf()
        )
        .map((date: string) => ({
          // this returns an array of objects with K:date T:string and K:array of history objects
          date,
          history: historyGroupsObj[date].sort(
            (a: ReqRes, b: ReqRes) =>
              b.createdAt.valueOf() - a.createdAt.valueOf()
          ),
        }));

      appDispatch(historySet(historyGroupsArr));
    } catch (err) {
      console.error('Error in getHistory', err);
    }
  },
};

export default historyController;
