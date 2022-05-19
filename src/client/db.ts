import Dexie, { Table } from 'dexie';

interface History {
  id: string;
  createdAt: string;
}

interface Collections {
  id: string;
  createdAt: string;
  name: string;
}

interface Profile {
  node_id: string;
  id: string;
  login: string;
}

interface Repos {
  node_id: string;
  id: string;
}

interface Files {
  repository: any;
  sha: string;
}

interface Auth {
  session: string;
  auth: string;
}

class SwellDB extends Dexie {
  history!: Table<History, string>;
  
  collections!: Table<Collections, string>;

  profile!: Table<Profile, string>;

  repos!: Table<Repos, string>;

  files!: Table<Files, string>;

  auth!: Table<Auth, string>
  
  constructor() {
    super('SwellDB');
    this.on('versionchange', (event => {
      const confirmation = confirm(`Another page tries to upgrade the database to version ${event.newVersion}. Accept?`);
      if (confirmation) {
        // Refresh current webapp so that it starts working with newer DB schema.
        return window.location.reload();
      }
      return false
    }))
    this.version(4).stores({
      history: 'id, createdAt',
      collections: 'id, createdAt, &name',
      profile: 'node_id, &id, login',
      repos: 'node_id, &id, name, full_name, created_at, updated_at',
      files: 'sha',
      auth: 'session'
    });
    this.version(3).stores({
      history: 'id, createdAt',
      collections: 'id, createdAt, &name'
    });
    this.version(2).stores({
      history: 'id, created_at',
      collections: 'id, created_at, &name'
    });
    this.version(1).stores({
      history: 'id, created_at'
    });
  }
}

export default new SwellDB();
