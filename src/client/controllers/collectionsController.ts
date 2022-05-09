import { v4 as uuid } from 'uuid';
import db from '../db';
import * as store from '../store';
import * as actions from '../actions/actions';
import { Workspace, WindowAPIObject, WindowExt } from '../../types';
import axios from 'axios';
import { Octokit } from 'octokit';
import { Buffer } from 'node:buffer';
import githubController from './githubController';

const { api }: { api: WindowAPIObject } = window as unknown as WindowExt;

api.receive('add-collection', (collectionData: any) => {
  // Add parsed text file to db
  collectionsController.addCollectionToIndexedDb([collectionData]);
  collectionsController.getCollections();
});

const collectionsController = {
  addCollectionToIndexedDb(collection: Workspace[]): void {
    // this method needs to recieve an array of workspaces 
    for (let workspace of collection) {
      db.table('collections')
      .put(workspace)
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
      .catch((err: string) => console.log('Error in getCollections', err));
  },

  collectionNameExists(obj: Workspace): Promise<boolean> {
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

  exportToFile(id: string): void {
    console.log('exportToFile', id)
    db.table('collections')
      .where('id')
      .equals(id)
      .first((foundCollection: Workspace) => {
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

  async exportToGithub(id: string): Promise<void> {
    console.log('exportToGithub', id)
    const token = await db.auth.toArray();
    const octokit = new Octokit({
      auth: token[0].auth,
    })
    let repos = await db.repos.toArray()
    let userProfile = await db.profile.toArray()

    const toExport = await db.table('collections')
      .where('id')
      .equals(id)
      .first((foundWorkspace: Workspace) => {
        // if workspace doesn't have members, add it using node_id
        if (!foundWorkspace.members) {
          foundWorkspace.members = [userProfile[0].node_id]
        }
        return foundWorkspace;
      })
      .catch((error: Record<string, undefined>) => {
        console.error(error.stack || error);
        throw(error);
      });
    // make popup, for now hardcoding
    const date = Date.now()
    console.log(date.toString())
    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: userProfile[0].login,
      repo: 'swell-file-does-not-exist',
      path: '.swell',
      message: `saving ${toExport.name} @ ${new Date(Date.now()).toString()}`,
      committer: {
        name: 'Swell App',
        email: 'swell@swell.com'
      },
      content: Buffer.from(JSON.stringify(toExport)).toString('base64'),
    })
    console.log('octokit response', response)
    setTimeout(async () => {
      const userData = await githubController.getUserData(token[0].auth);
      githubController.saveUserDataToDB(userData, token[0].auth)
    }, 1000)

  },

  importCollection(collection: Workspace): Promise<string> {
    return new Promise((resolve) => {
      api.send('import-collection', collection);
      api.receive('add-collection', (workspaces: Workspace[]) => {
        // console.log('importCollection', workspaces)
        collectionsController.addCollectionToIndexedDb(workspaces);
        collectionsController.getCollections();
        resolve('okie dokie');
      });
    });
  },
  
  importFromGithub(joinedWorkspaces: Workspace[]): Promise<string> {
    return new Promise((resolve) => {
      api.send('import-from-github', joinedWorkspaces);
      api.receive('add-collection', (workspaces: Workspace[]) => {
        collectionsController.addCollectionToIndexedDb(workspaces);
        collectionsController.getCollections();
        resolve('okie dokie');
      });
    });
  },
};

export default collectionsController;

