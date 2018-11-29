import * as store from '../store';
import * as actions from '../actions/actions';
import db from '../db';

const dbController = {

  addToHistory (reqRes) {
    db.history.put(reqRes)
      .then(() => {})
      .catch((err) => console.log('Error in addToHistory', err))

  },

  deleteFromHistory (id) {
    db.history.delete(id)
      .then(() => {})
      .catch((err) => console.log('Error in deleteFromHistory', err))
  },

  getHistory () { 
    db.table('history')
      .toArray()
      .then(history => { 
        store.default.dispatch(actions.getHistory(history));
      })
      .catch(err => console.log('Error in getHistory', err));
  }

}

export default dbController;