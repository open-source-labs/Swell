// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import uuid from 'uuid/v4';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../d... Remove this comment to see the full error message
import db from '../db';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../s... Remove this comment to see the full error message
import * as store from '../store';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../a... Remove this comment to see the full error message
import * as actions from '../actions/actions';
import { CollectionsArray } from '../../types';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Window & ty... Remove this comment to see the full error message
const { api } = window;

api.receive('add-collection', (collectionData: any) => {
  // Add parsed text file to db
  collectionsController.addCollectionToIndexedDb(JSON.parse(collectionData));
  collectionsController.getCollections();
});

const collectionsController = {
  addCollectionToIndexedDb(collection: CollectionsArray): void {
    db.table('collections')
      .put(collection)
      .catch((err: string) => console.log('Error in addToCollection', err));
  },

  deleteCollectionFromIndexedDb(id: string): void {
    db.table('collections')
      .delete(id)
      .catch((err: string) => console.log('Error in deleteFromCollection', err));
  },

  updateCollectionInIndexedDb(collection: CollectionsArray): void {
    collectionsController.deleteCollectionFromIndexedDb(collection.id);
    collectionsController.addCollectionToIndexedDb(collection);
  },

  getCollections(): void {
    db.table('collections')
      .toArray()
      .then((collections: CollectionsArray[] ) => {
        collections.forEach((collection: CollectionsArray) => {
          collection.createdAt = new Date(collection.createdAt);
        });
        const collectionsArr = collections.sort(
          (a: CollectionsArray, b: CollectionsArray) => b.createdAt.valueOf() - a.createdAt.valueOf()
        );
        store.default.dispatch(actions.getCollections(collectionsArr));
        console.log('collections', collectionsArr);
      })
      .catch((err: string) => console.log('Error in getCollection s', err));
  },

  collectionNameExists(obj: CollectionsArray): Promise<boolean> {
    const { name } = obj;
    return new Promise((resolve, reject) => {
      // resolve and reject are functions!
      db.table('collections')
        .where('name')
        .equalsIgnoreCase(name)
        .first((foundCollection: boolean) => !!foundCollection)
        .then((found: boolean) => resolve(found))
        .catch((error: Record<string, undefined>) => {
          console.error(error.stack || error);
          reject(error);
        });
    });
  },

  exportCollection(id: string): void {
    db.table('collections')
      .where('id')
      .equals(id)
      .first((foundCollection: CollectionsArray) => {
        // change name and id of collection to satisfy uniqueness requirements of db
        foundCollection.name += ' import';
        foundCollection.id = uuid();
        
        api.send('export-collection', { collection: foundCollection });
      })
      .catch((error: Record<string, undefined>) => {
        console.error(error.stack || error);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'reject'.
        reject(error);
      });
  },

  importCollection(collection: CollectionsArray): Promise<void> {
    return new Promise((resolve) => {
      api.send('import-collection', collection);
      api.receive('add-collection', (...args: any[]) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'any[]'.
        console.log('received data: ', JSON.parse(args.data));
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'any[]'.
        collectionsController.addCollectionToIndexedDb(JSON.parse(args.data));
        collectionsController.getCollections();
        // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
        resolve();
      });
    });
  },
};

export default collectionsController;
