import * as store from '../store';
import * as actions from '../actions/actions';
import db from '../db';
// import uuid from 'uuid/v4';

const collectionsController = {

  addCollectionToIndexedDb(collection) {
    db.collections.put({ ...collection })
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
  },

  collectionNameExists(obj) {
    const { name } = obj
    console.log(name)
    return new Promise((resolve, reject) => { //resolve and reject are functions!
      db.collections.where("name").equalsIgnoreCase(name).first(foundCollection => {
      foundCollection ? console.log(`Found ${name}`) : console.log("nope not here")
      return !!foundCollection
    })
      .then((found) => { console.log("found: ", found); resolve(found)})
      .catch(error => {
        console.error(error.stack || error);
        reject(error)
      });
    })
  }
}

export default collectionsController;