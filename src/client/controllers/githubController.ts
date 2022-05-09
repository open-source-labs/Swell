import { v4 as uuid } from 'uuid';
import db from '../db';
import * as store from '../store';
import * as actions from '../actions/actions';
import { GithubData, WindowAPIObject, WindowExt } from '../../types';
import axios from 'axios';
import { Octokit } from 'octokit';
import Cookies from 'js-cookie';

const { api }: { api: WindowAPIObject } = window as unknown as WindowExt;

const githubController = { 
  async importFromRepo(): Promise<string> {
    // setup authorization
    const token = await db.auth.toArray();
    console.log(await db.files.toArray())
    const octokit = new Octokit({
      auth: token[0].auth,
    })
    Cookies.set('auth', token[0].auth);
    // need to select potential .swell files from a list of repos
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'swell-gal',
      repo: 'swell-file-exists',
      path: '.swell'
    })
    // console.log('github import', Buffer.from(response.data.content, 'base64').toString('UTF-8'))
    return JSON.parse(Buffer.from(response.data.content, 'base64').toString('UTF-8'));
  },

  async updateUserDataToDB(auth: string): Promise<void> {
    const data = await this.getUserData(auth);
    await this.saveUserDataToDB(data, auth);
  },

  async getUserData(auth: string): Promise<GithubData> {
    Cookies.set('auth', auth);
    const response = await axios.get('api/getUserData', {
      withCredentials: true,
      headers: { Accept: 'application/json', 'Content-Type': 'text/json' },
    })
    console.log('getUserData', response)
    return response.data;
  },

  async saveUserDataToDB(data: GithubData, auth: string): Promise<void> {
    // there is only one session, auth is overwritten when a new one is made'
    db.table('auth')
    .put({session: '1', auth: auth})
    .catch((err: string) => console.log('Error in saveUserDataToDB auth', err));
    db.table('profile')
    .put(data.profile)
    .catch((err: string) => console.log('Error in saveUserDataToDB profile', err));
    for (let repo of data.repos) {
      db.table('repos')
      .put(repo)
      .catch((err: string) => console.log('Error in saveUserDataToDB repos', err));
    }
    db.table('files').clear()
    for (let file of data.files) {
      db.table('files')
      .put(file)
      .catch((err: string) => console.log('Error in saveUserDataToDB files', err));
    }
    console.log('db updated')
  },
}

export default githubController;