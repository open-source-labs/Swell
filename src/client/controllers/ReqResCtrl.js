import * as actions from '../actions';

const serverController = {
  openConnection(e) {
    e.preventDefault();
    console.log('Open a Req/Res connection');
  },
  closeConnection(e) {
    e.preventDefault();
    console.log('Close a Req/Res connection');

  },
  openAllConntections(e) {
    e.preventDefault();
    console.log('Open all Req/Res connections');

  },
  closeAllConnections(e) {
    e.preventDefault();
    console.log('Close all Req/Res connection');
  }
};


const methodController = {
  get() {},
  head() {},
  post() {},
  put() {},
  delete() {},
  connect() {},
  options() {},
  trace() {},
  patch()
}

const fetchController = {
  return fetch(url, {
      method: submittedMethod,
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
}

export default controller(serverActions, methodOperator, fetchOperator);