import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
const { session } = require('electron').remote
const { ipcRenderer } = require('electron')

import * as store from '../store';
import * as actions from '../actions/actions';

const graphQLController = {

  openGraphQLConnection(reqResObj) {
    // initialize response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.response.cookies = [];
    reqResObj.connection = 'open';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));
    
    this.sendGqlToMain({reqResObj})
    .then(response => {
      response.error ? this.handleError(response.error, response.reqResObj) : this.handleResponse(response.data, response.reqResObj);
    });
  },

  // handles graphQL queries and mutations
  sendGqlToMain(args) {
    return new Promise(resolve => {
      ipcRenderer.send('open-gql', args)
      ipcRenderer.on('reply-gql', (event, result) => {
        // needs formatting because component reads them in a particular order
        result.reqResObj.response.cookies = this.cookieFormatter(result.reqResObj.response.cookies);
        resolve(result);
      })
    })
  },

  openSubscription(reqResObj) {
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'open';
    store.default.dispatch(actions.reqResUpdate(reqResObj));
    
    const wsUri = reqResObj.url;
    const wsClient = new SubscriptionClient(wsUri, { reconnect: true });
    const wsLink = new WebSocketLink(wsClient);
    
    const apolloClient = new ApolloClient({
      link: wsLink,
      cache: new InMemoryCache()
    });

    const query = gql`${reqResObj.request.body}`;
    const variables = reqResObj.request.bodyVariables ? JSON.parse(reqResObj.request.bodyVariables) : {};

    apolloClient.subscribe({
      query,
      variables,
    }).subscribe({
      next (subsEvent) {
        // Notify your application with the new arrived data
        reqResObj.response.events.push(JSON.stringify(subsEvent.data));
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      }
    });
  },

  handleResponse(response, reqResObj) {
    reqResObj.connection = 'closed';
    reqResObj.connectionType = 'plain';
    reqResObj.timeReceived = Date.now();
    reqResObj.response.events.push(JSON.stringify(response.data));
    store.default.dispatch(actions.reqResUpdate(reqResObj));
  },
  
  handleError(errorsObj, reqResObj) {
    reqResObj.connection = 'error';
    reqResObj.timeReceived = Date.now();
    reqResObj.response.events.push(JSON.stringify(errorsObj));
    store.default.dispatch(actions.reqResUpdate(reqResObj));
  },

  // objects that travel over IPC API have their properties alphabetized...
  cookieFormatter(cookieArray) {
    return cookieArray.map((eachCookie) => {
      const cookieFormat = {
        name: eachCookie.name,
        value: eachCookie.value,
        domain: eachCookie.domain,
        hostOnly: eachCookie.hostonly ? eachCookie.hostonly : false,
        path: eachCookie.path,
        secure: eachCookie.secure ? eachCookie.secure : false,
        httpOnly: eachCookie.httponly ? eachCookie.httponly : false,
        session: eachCookie.session ? eachCookie.session : false,
        expriationDate: eachCookie.expires ? eachCookie.expires : '',
      }
      return cookieFormat;
    })
  }
};

export default graphQLController;