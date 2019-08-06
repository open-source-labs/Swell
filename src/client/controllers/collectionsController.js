import * as store from '../store';
import * as actions from '../actions/actions';
import db from '../db';
import format from 'date-fns/format';
import parse from 'date-fns/parse'
import uuid from 'uuid/v4';

const collectionsController = {

  addCollectionToIndexedDb(collection) {
    db.collections.put({...collection, id: uuid()})
      .catch((err) => console.log('Error in addToCollection', err))
  },

  deleteCollectionFromIndexedDb(id) {
    db.collections.delete(id)
      .catch((err) => console.log('Error in deleteFromCollection', err))
  },

  getCollections() {
    db.table('collections')
      .toArray()
      .then(collections => {
        const collectionsArr = collections.sort((a, b) => b.created_at - a.created_at);
        store.default.dispatch(actions.getCollections(collectionsArr));
      })
      .catch(err => console.log('Error in getCollections', err));
  }
}

export default collectionsController;