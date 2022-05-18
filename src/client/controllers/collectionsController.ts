import { v4 as uuid } from 'uuid';
import db from '../db';
import * as store from '../store';
import * as actions from './../features/business/businessSlice';
import * as uiactions from './../features/ui/uiSlice';
import { Collection, WindowAPI, WindowExt } from '../../types';
import axios from 'axios';
import { Octokit } from 'octokit';
import { Buffer } from 'node:buffer';
import githubController from './githubController';

const { api }: { api: WindowAPI } = window as unknown as WindowExt;


api.receive('add-collections', (collectionArr: Collection[]) => {
  // Add parsed text file to db
  collectionsController.addCollectionToIndexedDb(collectionArr);
  collectionsController.getCollections();
});

const collectionsController = {
  addCollectionToIndexedDb(collectionArr: Collection[]): void {
    // this method needs to recieve an array of workspaces 
    console.log('arr', collectionArr)
    for (let collection of collectionArr) {
      console.log('put collection', collection)
      db.table('collections')
      .put(collection)
      .catch((err: string) => console.log('Error in addToCollection', err));
    }
  },

  deleteCollectionFromIndexedDb(id: string): void {
    db.table('collections')
      .delete(id)
      .catch((err: string) => console.log('Error in deleteFromCollection', err));
  },

  updateCollectionInIndexedDb(collection: Collection): void {
    collectionsController.deleteCollectionFromIndexedDb(collection.id);
    collectionsController.addCollectionToIndexedDb([collection]);
  },

  getCollections(): void {
    db.table('collections')
      .toArray()
      .then((collections: Collection[] ) => {
        collections.forEach((collection: Collection) => {
          collection.createdAt = new Date(collection.createdAt);
        });
        const collectionsArr = collections.sort(
          (a: Collection, b: Collection) => b.createdAt.valueOf() - a.createdAt.valueOf()
        );
        store.default.dispatch(actions.getCollections(collectionsArr));
      })
      .catch((err: string) => console.log('Error in getCollections', err));
  },

  collectionNameExists(obj: Collection): Promise<boolean> {
    const { name } = obj;
    return new Promise((resolve, reject) => {
      // resolve and reject are functions!
      db.table('collections')
      db.table('repo')
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

  //OLD EXPORT TO FILES
  exportToFile(id: string): void {
    console.log('exportToFile', id)
    db.table('collections')
      .where('id')
      .equals(id)
      .first((foundCollection: Collection) => {
        // TODO: we change uuid on export but is this what we want??
        foundCollection.name += ' export';
        foundCollection.id = uuid();
        api.send('export-collection', { collection: foundCollection });
      })
      .catch((error: Record<string, undefined>) => {
        console.error(error.stack || error);
        throw(error);
      });
  },

  //OLD EXPORT TO GITHUB
  async exportToGithub(name: string): Promise<void> {
    const token = await db.auth.toArray();
    const octokit = new Octokit({
      auth: token[0].auth,
    })
    let userProfile = await db.profile.toArray()

    // make popup, for now hardcoding
    const date = Date.now()
    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: userProfile[0].login,
      repo: name,
      path: '.swell',
      message: `saving ${name} @ ${new Date(Date.now()).toString()}`,
      committer: {
        name: 'Swell App',
        email: 'swell@swell.com'
      },
      content: Buffer.from(JSON.stringify(toExport)).toString('base64'),
    })
    setTimeout(async () => {
      const userData = await githubController.getUserData(token[0].auth);
      githubController.saveUserDataToDB(userData, token[0].auth)
    }, 1000)

  },

  exportCollection(collection: Collection): Promise<string> {
    return new Promise((resolve) => {
      api.send('export-collection', collection);
      api.receive('add-collections', (collection: Collection[]) => {
        // collectionsController.addCollectionToIndexedDb(collection);
        collectionsController.getCollections();
        resolve('okie dokie');
      });
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
  
  importFromGithub(collectionArr: Collection[]): Promise<string> {
    return new Promise((resolve) => {
      api.send('import-from-github', collectionArr);
      api.receive('add-collections', (collection: Collection[]) => {
        collectionsController.addCollectionToIndexedDb(collection);
        collectionsController.getCollections();
        resolve('okie dokie');
      });
    });
  },
};

export default collectionsController;

