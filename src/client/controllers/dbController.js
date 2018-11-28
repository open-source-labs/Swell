import * as store from '../store';
import * as actions from '../actions/actions';
import db from '../db';

const dbController = {

  addToHistory (reqRes) {
    db.history.put(reqRes)
      .then(() => console.log('added to indexedDb'))
  },

  getHistory () { 
    console.log('in getHistory');
    db.table('history')
      .toArray()
      .then(history => { 
        console.log('HISTORY', history);
        store.default.dispatch(actions.getHistory(history));
      })
      .catch(err => console.log(err));
  }

}

export default dbController;