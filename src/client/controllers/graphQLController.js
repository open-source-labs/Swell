import * as store from '../store';
import * as actions from '../actions/actions';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const graphQLController = {

  openGraphQLConnection(reqResObj, connectionArray) {
    // initialize response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    /*
    TODO: Investigate this code from httpController
    
    connectionArray.forEach((obj, i) => {
      if (obj.id === reqResObj.id) {
        connectionArray.splice(i, 1);
      }
    });
    const openConnectionObj = {
      abort: new AbortController(),
      protocol: 'HTTP1',
      id: reqResObj.id,
    };

    connectionArray.push(openConnectionObj);
    */

    // Query specific implementation
    // TODO: Implement mutations and subscriptions
    const query = gql`${reqResObj.request.body}`;
    const client = new ApolloClient({ uri: reqResObj.url });
    client.query({ query })
      // Update the store with the response
      .then((data) => {
        const reqResCopy = JSON.parse(JSON.stringify(reqResObj));
        // TODO: Add response headers, cookies
        reqResCopy.connection = 'closed';
        reqResCopy.connectionType = 'plain';
        reqResCopy.timeReceived = Date.now();
        reqResCopy.response.events.push(JSON.stringify(data.data));
        store.default.dispatch(actions.reqResUpdate(reqResCopy));
      })
      .catch((err) => {
        reqResObj.connection = 'error';
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      });
  }
};

export default graphQLController;
