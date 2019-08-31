import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';

import * as store from '../store';
import * as actions from '../actions/actions';


const graphQLController = {

  openGraphQLConnection(reqResObj) {
    // initialize response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'open';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    // TODO: Add request cookies
    const headers = {};
    // added filter to take out Content-Type header because it's hard coded on front end and set by createHttpLink
    reqResObj.request.headers.filter(item => item.key !== 'Content-Type').forEach((item) => {
      headers[item.key] = item.value;
    });

    // afterware takes headers from context response object, copies to reqResObj
    // ? way to iterate through all headers ?
    const afterLink = new ApolloLink((operation, forward) => {
      return forward(operation).map(response => {
        const context = operation.getContext();
        const responseHeaders = context.response.headers;
        
        for (let headerItem of responseHeaders.entries()) {
          const key = headerItem[0].split('-').map(item => item[0].toUpperCase() + item.slice(1)).join('-')
          reqResObj.response.headers[key] = headerItem[1];
        }
        
        return response;
      });
    });

    const client = new ApolloClient({
      // moved headers object into createHttpLink arguments
      link: afterLink.concat(createHttpLink({ uri: reqResObj.url, headers })),
      credentials: 'same-origin',
      cache: new InMemoryCache(),
    });

    const body = gql`${reqResObj.request.body}`;
    const variables = reqResObj.request.bodyVariables ? JSON.parse(reqResObj.request.bodyVariables) : {};

    if (reqResObj.request.method === 'QUERY') {
      client.query({ query: body, variables })
        .then(data => this.handleResponse(data, reqResObj))
        .catch((err) => {
          console.error(err);
          reqResObj.connection = 'error';
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        });
    }
    else if (reqResObj.request.method === 'MUTATION') {
      client.mutate({ mutation: body, variables })
        .then(data => this.handleResponse(data, reqResObj))
        .catch((err) => {
          reqResObj.connection = 'error';
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        });
    }
  },

  openSubscription(reqResObj) {
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'open';
    store.default.dispatch(actions.reqResUpdate(reqResObj));
  },

  handleResponse(response, reqResObj) {
    const reqResCopy = JSON.parse(JSON.stringify(reqResObj));
    // TODO: Add response headers, cookies
    reqResCopy.connection = 'closed';
    reqResCopy.connectionType = 'plain';
    reqResCopy.timeReceived = Date.now();
    reqResCopy.response.events.push(JSON.stringify(response.data));
    store.default.dispatch(actions.reqResUpdate(reqResCopy));
  },
};

export default graphQLController;