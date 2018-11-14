import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import * as actions from '../actions';

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



export default connect(endPointIntake, fetchController)(ReqRestCtrl);
