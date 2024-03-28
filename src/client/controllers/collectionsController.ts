import { v4 as uuid } from 'uuid';
import db from '../db';

import { appDispatch } from '../toolkit-refactor/store';
import { collectionsReplaced } from '../toolkit-refactor/slices/collectionsSlice';

import { Collection, WindowAPI, WindowExt } from '../../types';

const { api }: { api: WindowAPI } = window as unknown as WindowExt;



api.receive('add-collections', (collectionArr: Collection[]) => {
  // Add parsed text file to db
  collectionsController.addCollectionToIndexedDb(collectionArr);
  collectionsController.getCollections();
});

const collectionsController = {
  addCollectionToIndexedDb(collectionArr: Collection[]): void {
    // this method needs to recieve an array of workspaces
    console.log('arr', collectionArr);
    for (let collection of collectionArr) {
      console.log('put collection', collection);
      db.table('collections')
        .put(collection)
        .catch((err: string) => console.log('Error in addToCollection', err));
    }
  },

  deleteCollectionFromIndexedDb(id: string): void {
    db.table('collections')
      .delete(id)
      .catch((err: string) => console.log('Error in deleteCollection', err));
  },

  updateCollectionInIndexedDb(collection: Collection): void {
    collectionsController.deleteCollectionFromIndexedDb(collection.id);
    collectionsController.addCollectionToIndexedDb([collection]);
  },

  getCollections(): void {
    db.table('collections')
      .toArray()
      .then((collections: Collection[]) => {
        collections.forEach((collection: Collection) => {
          collection.createdAt = new Date(collection.createdAt);
        });
        const collectionsArr = collections.sort(
          (a: Collection, b: Collection) =>
            b.createdAt.valueOf() - a.createdAt.valueOf()
        );
        appDispatch(collectionsReplaced(collectionsArr));
      })
      .catch((err: string) => console.log('Error in getCollections', err));
  },

  collectionNameExists(name: string): Promise<boolean> {
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

  exportToFile(id: string): void {
    console.log('exportToFile', id);
    db.table('collections')
      .where('id')
      .equals(id)
      .first((foundCollection: Collection) => {
        /**
         * @todo UUID is being changed on export; figure out if that makes
         * sense
         */
        foundCollection.name += ' export';
        foundCollection.id = uuid();
        api.send('export-collection', { collection: foundCollection });
      })
      .catch((error: Record<string, undefined>) => {
        console.error(error.stack || error);
        throw error;
      });
  },

  importCollection(collection: Collection): Promise<string> {
    return new Promise((resolve) => {
      api.send('import-collection', collection);
      api.receive('add-collections', (collection: Collection[]) => {
        collectionsController.addCollectionToIndexedDb(collection);
        collectionsController.getCollections();
        resolve('okie dokie');
      });
    });
  },
};

export default collectionsController;

