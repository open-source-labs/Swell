import Dexie from 'dexie';

const db = new Dexie('Swell');
db.version(1).stores({ 
  history: 'id, created_at' 
});

export default db;