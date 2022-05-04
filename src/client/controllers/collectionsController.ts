import { v4 as uuid } from 'uuid';
import db from '../db';
import * as store from '../store';
import * as actions from '../actions/actions';
import { Workspace, Workspaces, WindowAPIObject, WindowExt } from '../../types';

const { api }: { api: WindowAPIObject } = window as unknown as WindowExt;

api.receive('add-collection', (collectionData: any) => {
  // Add parsed text file to db
  collectionsController.addCollectionToIndexedDb(collectionData);
  collectionsController.getCollections();
});

const collectionsController = {
  addCollectionToIndexedDb(collection: Workspace[]): void {
    // if (Array.isArray(collection) === false) collection = [collection];
    console.log('addCollection type', typeof collection)
    console.log('addCollection', collection)
    for (let workspace of collection) {
       let workspaceJSON= JSON.stringify(workspace);
      console.log('stringified workspace', workspaceJSON)
      db.table('collections')
      .put(workspaceJSON)
      .catch((err: string) => console.log('Error in addToCollection', err));
    }

  },

  deleteCollectionFromIndexedDb(id: string): void {
    db.table('collections')
      .delete(id)
      .catch((err: string) => console.log('Error in deleteFromCollection', err));
  },

  updateCollectionInIndexedDb(collection: Workspace): void {
    collectionsController.deleteCollectionFromIndexedDb(collection.id);
    collectionsController.addCollectionToIndexedDb([collection]);
  },

  getCollections(): void {
    db.table('collections')
      .toArray()
      .then((collections: Workspace[] ) => {
        collections.forEach((collection: Workspace) => {
          collection.createdAt = new Date(collection.createdAt);
        });
        const collectionsArr = collections.sort(
          (a: Workspace, b: Workspace) => b.createdAt.valueOf() - a.createdAt.valueOf()
        );
        store.default.dispatch(actions.getCollections(collectionsArr));
      })
      .catch((err: string) => console.log('Error in getCollection s', err));
  },

  collectionNameExists(obj: Workspace): Promise<boolean> {
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
      .first((foundCollection: Workspace) => {
        // change name and id of collection to satisfy uniqueness requirements of db
        foundCollection.name += ' export';
        foundCollection.id = uuid();
        
        api.send('export-collection', { collection: foundCollection });
      })
      .catch((error: Record<string, undefined>) => {
        console.error(error.stack || error);
        throw(error);
      });
  },

  importCollection(collection: Workspace): Promise<string> {
    return new Promise((resolve) => {
      api.send('import-collection', collection);
      api.receive('add-collection', (...args: Workspace[]) => {
        console.log('importCollection', args)
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'any[]'.
        collectionsController.addCollectionToIndexedDb(JSON.parse(JSON.stringify(args.data)));
        collectionsController.getCollections();
      
        resolve('okie dokie');
      });
    });
  },

  // export interface Workspace {
  //   createdAt: Date;
  //   modifiedAt: Date;
  //   id: string;
  //   name: string;
  //   members?: string[];
  //   data?: Record<string, unknown>[];
  //   reqResArray: NewRequestResponseObject[];
  // }
  
  importFromGithub(joinedWorkspaces: Workspace[]): Promise<string> {
    return new Promise((resolve) => {
      api.send('import-from-github', joinedWorkspaces);
      console.log('got here');
      api.receive('add-collection', (...args: Workspace[]) => {
        console.log('add-collection', args)
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'any[]'.
        // collectionsController.addCollectionToIndexedDb(args.data);
        // collectionsController.getCollections();
      
        resolve('okie dokie');
      });
    });
  },
};

export default collectionsController;

