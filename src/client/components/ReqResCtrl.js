import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as store from '../store';
import * as actions from '../actions/actions';
import * as actionTypes from '../actions/actionTypes';

const ReqResCtrl = {
  parseReqObject(object) {
    let { id, url, timeSent, timeReceived, connection, conntectionType, request: { method }, request: { headers }, request: { body} } = object;

    method = method.toUpperCase();

    let outputObj = {
      method: method,
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
    };

    if (method !== 'GET' && method !== 'HEAD') {
      outputObj.body = JSON.stringify(body)
    }

    ReqResCtrl.fetchController(outputObj, url, object)
  },

  /* Utility function to open fetches */
  fetchController(parsedObj, url, originalObj) {
    let timeSentSnap = Date.now();

    return fetch(url, parsedObj)
      .then(response => {
        let reader = response.body.getReader();
        // console.log(reader);
        read();

        // console.log(originalObj);
        const newObj = JSON.parse(JSON.stringify(originalObj));

        newObj.timeSent = timeSentSnap;
        newObj.timeReceived = Date.now();
        newObj.response = {
          headers: [response.headers],
          events: [],
        };

        newObj.connection = 'open';
        newObj.connectionType = 'SSE';

        function read() {
          reader.read().then(obj => {
            // console.log(obj);
            if (obj.done) {
              // console.log('finished');
              return;
            } else {
              let string = new TextDecoder("utf-8").decode(obj.value);
              newObj.response.events.push({
                data: string,
                timeReceived: Date.now()
              });
              // console.log(string);
              store.default.dispatch( actions.reqResUpdate(newObj) );
              read();
            }
          });
        }
      });
  },
  toggleEndPoint(e) {
    console.log('log')
  },
  /* Creates a REQ/RES Obj based on event data and passes the object to fetchController */
  openEndPoint(e) {
    const reqResComponentID = e.target.id;
    const gotState = store.default.getState();
    const reqResArr = gotState.business.reqResArray;

    // Search the store for the passed in ID
    const reqResObj = reqResArr.find((el) => el.id == reqResComponentID);

    ReqResCtrl.parseReqObject(reqResObj);
    // Send to fetchController callback
    // ReqResCtrl.fetchController(reqResObj);
  },

  /* Iterates across REQ/RES Array and opens connections for each object and passes each object to fetchController */
  openEndPoints(e) {
    for (let resReqObj of resReqArr) {
      fetchController(resReqArr[e.id].endPoint, resReqArr[e.id].method, resReqArr[e.id].serverType);
    }
  },

  /* Closes open endpoint */
  closeEndpoint(e) {
    resReqArr[e.id].close();
  },

  /* Closes all open endpoint */
  closeEndpoints(resReqArr, e) {
    for (let resReqObj of resReqArr) {
      closeEndpoint(resReqObj);
    }
  }
};



export default ReqResCtrl;
