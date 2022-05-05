import Dexie, { Table } from 'dexie';

class SwellDB extends Dexie {
  history: Table<Record<string, unknown>, string> | undefined;
  
  collections: Table<Record<string, unknown>, string> | undefined;

  profile: Table<Record<string, unknown>> | undefined;

  repos: Table<Record<string, unknown>> | undefined;

  files: Table<Record<string, unknown>> | undefined;
  
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
      profile: 'id',
      repos: 'id',
      files: 'sha'
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
