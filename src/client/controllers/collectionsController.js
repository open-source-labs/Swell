import { ipcRenderer } from "electron";
import uuid from "uuid/v4";
import db from "../db";
import * as store from "../store";
import * as actions from "../actions/actions";

ipcRenderer.on("add-collection", (event, args) => {
  collectionsController.addCollectionToIndexedDb(JSON.parse(args.data));
  collectionsController.getCollections();
});

const collectionsController = {
  addCollectionToIndexedDb(collection) {
    db.collections
      .put({ ...collection })
      .catch((err) => console.log("Error in addToCollection", err));
  },

  deleteCollectionFromIndexedDb(id) {
    db.collections
      .delete(id)
      .catch((err) => console.log("Error in deleteFromCollection", err));
  },

  getCollections() {
    db.table("collections")
      .toArray()
      .then((collections) => {
        const collectionsArr = collections.sort(
          (a, b) => b.created_at - a.created_at
        );
        store.default.dispatch(actions.getCollections(collectionsArr));
      })
      .catch((err) => console.log("Error in getCollections", err));
  },

  collectionNameExists(obj) {
    const { name } = obj;
    return new Promise((resolve, reject) => {
      // resolve and reject are functions!
      db.collections
        .where("name")
        .equalsIgnoreCase(name)
        .first((foundCollection) => !!foundCollection)
        .then((found) => resolve(found))
        .catch((error) => {
          console.error(error.stack || error);
          reject(error);
        });
    });
  },

  exportCollection(id) {
    db.collections
      .where("id")
      .equals(id)
      .first((foundCollection) => {
        // change name and id of collection to satisfy uniqueness requirements of db
        foundCollection.name += " import";
        foundCollection.id = uuid();

        ipcRenderer.send("export-collection", { collection: foundCollection });
      })
      .catch((error) => {
        console.error(error.stack || error);
        reject(error);
      });
  },

  importCollection(collection) {
    ipcRenderer.send("import-collection", collection);
  },
};

export default collectionsController;
