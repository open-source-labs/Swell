import { v4 as uuid } from 'uuid';
import db from '../db';
import * as store from '../store';
import * as actions from '../actions/actions';
import { GithubData, WindowAPIObject, WindowExt } from '../../types';

const { api }: { api: WindowAPIObject } = window as unknown as WindowExt;

const githubController = { 
  // save stuff to db
  saveUserDataToDB(data: GithubData): void {
    db.table('profile')
    .put(data.profile)
    .catch((err: string) => console.log('Error in saveUserDataToDB profile', err));
    for (let repo of data.repos) {
      db.table('repos')
      .put(repo)
      .catch((err: string) => console.log('Error in saveUserDataToDB repos', err));
    }
    for (let file of data.files) {
      db.table('files')
      .put(file)
      .catch((err: string) => console.log('Error in saveUserDataToDB files', err));
    }
  },
}

export default githubController;