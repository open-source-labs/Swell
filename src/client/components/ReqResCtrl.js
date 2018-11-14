import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import store from '../reducers/index'; //index would contain const createStoreWithMiddleware = applyMiddleware(thunkMiddleware,promise)(createStore); export default createStoreWithMiddleware(reducers);

/* Creates a REQ/RES Obj based on event data and passes the object to fetchController */
const openEndPoint = (resReqArr, e) => {
  fetchController(resReqArr[e.id].endPoint, resReqArr[e.id].method, resReqArr[e.id].serverType);
};

/* Iterates across REQ/RES Array and opens connections for each object and passes each object to fetchController */
const openEndPoints = (resReqArr, e) => {
  for(let resReqObj of resReqArr) {
    fetchController(resReqArr[e.id].endPoint, resReqArr[e.id].method, resReqArr[e.id].serverType);
  }
};

/* Closes open endpoint */
const closeEndpoint = (resReqArr, e) => {
  resReqArr[e.id].close();
}

/* Closes all open endpoint */
const closeEndpoints = (resReqArr, e) => {
  for(let resReqObj of resReqArr) {
    closeEndpoint(resReqObj);
  }
}

/* Utility function to open fetches */
const fetchController = (endPoint, method, serverType) => {
  return fetch(endPoint, method, serverType, {
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

class ReqRestCtrl extends Component {
  constructor(props) {
    super(props);

    store.subscribe(() => {
      /* when store updates we map nessesary data to local component state */
      this.setState({
        resReqArr: store.getState().resReqArr
      });
    });
  }

  openConnection(e) {
      e.preventDefault();
      console.log('Open a Req/Res connection');
      openEndPoint(this.state.resReqArr, e);
    }

    openAllConntections(e) {
      e.preventDefault();
      console.log('Open all Req/Res connections');
      openEndPoints(this.state.resReqArr, e);
    }

    closeConnection(e) {
      e.preventDefault();
      console.log('Close a Req/Res connection');
      closeEndpoint(this.state.resReqArr, e);
    }

    closeAllConnections(e) {
      e.preventDefault();
      console.log('Close all Req/Res connection');
      closeEndpoints(this.state.resReqArr, e);
    }

  render() {
    return null;
  }
}

export default connect(endPointIntake, fetchController)(ReqRestCtrl);
