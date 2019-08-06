import * as store from '../store';
import * as actions from '../actions/actions';
import db from '../db';
import format from 'date-fns/format';
import parse from 'date-fns/parse'
import collectionsController from './collectionsController'

const historyController = {

  addHistoryToIndexedDb(reqRes) {
    db.history.put(reqRes)
      .catch((err) => console.log('Error in addToHistory', err))
    // collectionsController.addCollectionToIndexedDb({
    //   created_at: new Date(),
    //   name: "blepblepblep",
    //   reqResArray: [{
    //     "id": "e21f6b05-08b6-4058-ba2e-3fe492bc7e99",
    //     "created_at": "Sat Jul 20 2019 16: 11: 42 GMT - 0400(EDT)",
    //     "protocol": "http://",
    //     "host": "http://pokeapi.co",
    //     "path": "/api/v2/pokemon/squirtle",
    //     "checkSelected": false,
    //     "checked": false,
    //     "connection": "uninitialized",
    //     "connectionType": null,
    //     "created_at": "Sat Jul 20 2019 16: 11: 42 GMT - 0400(EDT)",
    //     "request": { method: "GET", headers: [], body: "", cookies: [], bodyType: "none" },
    //     "response": { headers: null, events: null },
    //     "tab": "First Tab",
    //     "timeReceived": null,
    //     "timeSent": null,
    //     "url": "http://pokeapi.co/api/v2/pokemon/squirtle"
    //   },
    //   {
    //     "id": "e21f6b05-08b6-4058-ba2e-3fe492bc7e99",
    //     "created_at": "Sat Jul 20 2019 16: 11: 42 GMT - 0400(EDT)",
    //     "protocol": "http://",
    //     "host": "http://pokeapi.co",
    //     "path": "/api/v2/pokemon/squirtle",
    //     "checkSelected": false,
    //     "checked": false,
    //     "connection": "uninitialized",
    //     "connectionType": null,
    //     "created_at": "Sat Jul 20 2019 16: 11: 42 GMT - 0400(EDT)",
    //     "request": { method: "GET", headers: [], body: "", cookies: [], bodyType: "none" },
    //     "response": { headers: null, events: null },
    //     "tab": "First Tab",
    //     "timeReceived": null,
    //     "timeSent": null,
    //     "url": "http://pokeapi.co/api/v2/pokemon/squirtle"
    //   }]
    // })

  },

  deleteHistoryFromIndexedDb(id) {
    db.history.delete(id)
      .catch((err) => console.log('Error in deleteFromHistory', err))
  },

  getHistory() {
    db.table('history')
      .toArray()
      .then(history => {
        const historyGroupsObj = history.reduce((groups, hist) => {
          const date = format(hist.created_at, 'MM/DD/YYYY')
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(hist);
          return groups;
        }, {});
        let historyGroupsArr = Object.keys(historyGroupsObj).sort((a, b) => parse(b) - parse(a)).map(date => {
          return {
            date: date,
            history: historyGroupsObj[date].sort((a, b) => b.created_at - a.created_at)
          };
        });
        store.default.dispatch(actions.getHistory(historyGroupsArr));
      })
      .catch(err => console.log('Error in getHistory', err));
  }
}

export default historyController;