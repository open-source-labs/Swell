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

  getCollection() {
    console.log("IN GET COLLECTION")
    db.table('collections')
      .toArray()
      .then(collections => {
        console.log(collections)
        // let collectionsArr = Object.keys(collection).sort((a, b) => parse(b) - parse(a)).map(date => {
        //   return {
        //     date: date,
        //     collections: collectionsGroupsObj[date]
        //   };
        // });
        // store.default.dispatch(actions.getCollection(collectionsArr));
      })
      .catch(err => console.log('Error in getCollection', err));
  }
}

export default collectionsController;