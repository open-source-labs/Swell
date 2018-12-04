import * as store from '../store';
import * as actions from '../actions/actions';
import db from '../db';
import format from 'date-fns/format';
import parse from 'date-fns/parse'

const dbController = {

  addToIndexDb (reqRes) {
    db.history.put(reqRes)
      .then(() => {})
      .catch((err) => console.log('Error in addToHistory', err))

  },

  deleteFromIndexDb (id) {
    db.history.delete(id)
      .then(() => {})
      .catch((err) => console.log('Error in deleteFromHistory', err))
  },

  getHistory () { 
    db.table('history')
      .toArray()
      .then(history => { 
        const historyGroupsObj = history.reduce((groups, hist) => {
          const date = format(hist.created_at, 'MM/DD/YYYY')
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(hist);
          return groups;
        }, {});
        let historyGroupsArr = Object.keys(historyGroupsObj).sort((a, b) => parse(b) - parse(a)).map(date => {
          return {
            date: date,
            history: historyGroupsObj[date].sort((a, b) => b.created_at - a.created_at)
          };
        });
        store.default.dispatch(actions.getHistory(historyGroupsArr));
      })
      .catch(err => console.log('Error in getHistory', err));
  }

}

export default dbController;