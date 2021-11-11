// started  dexie testing set up.
// I would suggest continue TDD by writing some collection tests, then
// importing the actual controllers and testing directlyerly

// const collectionsController = require("../src/client/controllers/collectionsController");
// const historyController = require("../src/client/controllers/historyController");

const Dexie = require('dexie');

// https://stackoverflow.com/questions/47934383/indexeddb-testing-with-jest-enzyme-referenceerror-indexeddb-is-not-defined
Dexie.dependencies.indexedDB = require('fake-indexeddb');
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

const db = new Dexie('test');

db.version(2).stores({
  history: 'id, createdAt',
  collections: 'id, createdAt, &name',
});

db.version(1).stores({
  history: 'id, createdAt',
});

// now we have db.history and db.collections

// for setup and teardown tasks that are asynchronous, take care to RETURN the promise
describe('db test', () => {
  beforeEach(() => db.history.clear().catch((err) => console.log(err)));
  afterEach(() => db.history.clear().catch((err) => console.log(err)));
  describe('history tests', () => {
    it('can add history with id', async () => {
      await db.history.put({ id: 8 });
      const count = await db.history.count();
      const arr = await db.history.toArray();
      expect(count).toEqual(1);
      expect(arr[0].id).toEqual(8);
    });

    it('will not add history with an empty object', async () => {
      db.history.put({}).catch((err) => expect(err.name).toEqual('DataError'));
      const count = await db.history.count();
      expect(count).toEqual(0);
    });

    it('will not add history without an id', async () => {
      await db.history
        .put({ createdAt: Date.now() })
        .catch((err) => expect(err.name).toEqual('DataError'));
      const count = await db.history.count();
      expect(count).toEqual(0);
    });
  });
});
// describe("collection tests", () => {});
// });
