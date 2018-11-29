import * as store from '../store';
import * as actions from '../actions/actions';
import db from '../db';

const dbController = {

  addToIndexDb (reqRes) {
    db.history.put(reqRes)
      .then(() => console.log('added to indexedDb'))
      .catch((err) => console.log('Error in addToHistory', err))

  },

  deleteFromIndexDb (id) {
    db.history.delete(id)
      .then(() => console.log('deleted from indexedDb'))
      .catch((err) => console.log('Error in deleteFromHistory', err))
  },

  getHistory () { 
    db.table('history')
      .toArray()
      .then(history => { 
        const historyGroupsObj = history.reduce((groups, hist) => {
          const date = JSON.stringify(hist.created_at).split('T')[0].substr(1);
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(hist);
          return groups;
        }, {});
        const historyGroupsArr = Object.keys(historyGroupsObj).map(date => {
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