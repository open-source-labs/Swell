import * as actions from '../actions';


const serverController = {
  openConnection(e) {
    e.preventDefault();
    console.log('Open a Req/Res connection');
    endPointIntake(e);
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

const endPointIntake = (e) => {
  const form = e.target;
  const data = new FormData(form);

  for (let name of data.keys()) {
    const endPoint = form.elements[endpoint];
    const method = form.elements[method];
    const serverType = form.elements[servertype];
  }

  fetchController(endPoint, method, serverType);
};


const fetchController = (endPoint, method) => {
  return fetch(endPoint, method, serverType,  {
      method: method,
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
};

export default controller(serverController, fetchController);