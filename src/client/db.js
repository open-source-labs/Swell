import Dexie from "dexie";

const db = new Dexie("Swell");

db.on("versionchange", function (event) {
  if (
    confirm(
      "Another page tries to upgrade the database to version " +
        event.newVersion +
        ". Accept?"
    )
  ) {
    // Refresh current webapp so that it starts working with newer DB schema.
    window.location.reload();
  } else {
    // Will let user finish its work in this window and
    // block the other window from upgrading.
    return false;
  }
});

db.version(2).stores({
  history: "id, created_at",
  collections: "id, created_at, &name",
});

db.version(1).stores({
  history: "id, created_at",
});

// db.open()

export default db;
