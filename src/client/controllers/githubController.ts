import { v4 as uuid } from 'uuid';
import db from '../db';
import { GithubData, WindowAPI, WindowExt } from '../../types';

import axios from 'axios';
import { Octokit } from 'octokit';
import Cookies from 'js-cookie';
import { Collection } from '../../types';

const { api }: { api: WindowAPI } = window as unknown as WindowExt;

const githubController = {
  async importFromRepo(): Promise<Collection[]> {
    // setup authorization
    const token = await db.auth.toArray();
    const octokit = new Octokit({
      auth: token[0].auth,
    });
    Cookies.set('auth', token[0].auth);
    // need to select potential .swell files from a list of repos
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: 'swell-gal',
        repo: 'swell-file-exists',
        path: '.swell',
      }
    );

    const parsedJson = JSON.parse(
      Buffer.from(response.data.content, 'base64').toString('UTF-8')
    );

    // Type assertion bad; should be removed when possible
    return parsedJson as Collection[];
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
    });
    return response.data;
  },

  async saveUserDataToDB(data: GithubData, auth: string): Promise<void> {
    // there is only one session, auth is overwritten when a new one is made'
    db.table('auth')
      .put({ session: '1', auth: auth })
      .catch((err: string) =>
        console.log('Error in saveUserDataToDB/auth', err)
      );
    db.table('profile')
      .put(data.profile)
      .catch((err: string) =>
        console.log('Error in saveUserDataToDB/profile', err)
      );
    for (let repo of data.repos) {
      db.table('repos')
        .put(repo)
        .catch((err: string) =>
          console.log('Error in saveUserDataToDB/repos', err)
        );
    }
    db.table('files').clear();
    for (let file of data.files) {
      db.table('files')
        .put(file)
        .catch((err: string) =>
          console.log('Error in saveUserDataToDB/files', err)
        );
    }
    console.log('db updated');
  },
};

export default githubController;

