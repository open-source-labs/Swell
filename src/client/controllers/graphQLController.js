import * as store from '../store';
import * as actions from '../actions/actions';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import { CLIENT_RENEG_LIMIT } from 'tls';

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


    const handleResponse = (data) => {
      const reqResCopy = JSON.parse(JSON.stringify(reqResObj));
      // TODO: Add response headers, cookies
      reqResCopy.connection = 'closed';
      reqResCopy.connectionType = 'plain';
      reqResCopy.timeReceived = Date.now();
      reqResCopy.response.events.push(JSON.stringify(data.data));
      store.default.dispatch(actions.reqResUpdate(reqResCopy));
    };

    // TODO: Add request cookies
    const headers = {};
    reqResObj.request.headers.forEach((item) => {
      headers[item.key] = item.value;
    });

    const body = gql`${reqResObj.request.body}`;
    const client = new ApolloClient({
      uri: reqResObj.url,
      headers,
      cache: new InMemoryCache(),
    });

    // Query specific implementation
    if (reqResObj.request.method === 'QUERY') {
      client.query({ query: body })
        // Update the store with the response
        .then(data => handleResponse(data))
        .catch((err) => {
          reqResObj.connection = 'error';
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        });
    }
    else if (reqResObj.request.method === 'MUTATION') {
      client.mutate({ mutation: body })
        .then(data => handleResponse(data))
        .catch((err) => {
          reqResObj.connection = 'error';
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        });
    }

    // TODO: Implement mutations and subscriptions
  }
};

export default graphQLController;
