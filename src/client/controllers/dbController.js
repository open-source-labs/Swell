import * as store from '../store';
import * as actions from '../actions/actions';
import db from '../db';

const dbController = {

  addToHistory (reqRes) {
    db.history.put(reqRes)
      .then(() => console.log('added to indexedDb'))
  }
}

export default dbController;