import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from "apollo-link-error";
import { WebSocketLink } from 'apollo-link-ws';
const { session } = require('electron').remote

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

    // populating headers object with response headers - except for Content-Type
    const headers = {};
    reqResObj.request.headers.filter(item => item.key !== 'Content-Type').forEach((item) => {
      headers[item.key] = item.value;
    });

    // set all user's cookie in the application's cookie storage
    if (reqResObj.request.cookies.length) {
      reqResObj.request.cookies.forEach(userCookie => {
        session.defaultSession.cookies.set({ url: 'http://localhost:8080/', name: userCookie.key, value: userCookie.value }, (error) => {
          if (error) console.error(error)
        });
      })
    }

    // error link - passes networkError to handler
    const errorLink = onError(({ networkError }) => {
      this.handleError(networkError, reqResObj);
    });

    // afterware takes headers from context response object, copies to reqResObj
    const afterLink = new ApolloLink((operation, forward) => {
      return forward(operation).map(response => {
        const context = operation.getContext();

        for (let headerItem of context.response.headers.entries()) {
          const key = headerItem[0].split('-').map(item => item[0].toUpperCase() + item.slice(1)).join('-');
          reqResObj.response.headers[key] = headerItem[1];
        }

        return response;
      });
    });

    // creates http connection to host
    const httpLink = createHttpLink({ uri: reqResObj.url, headers, credentials: 'same-origin' });

    // additive composition of multiple links
    const link = ApolloLink.from([
      errorLink,
      afterLink,
      httpLink
    ]);

    const client = new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });

    const body = gql`${reqResObj.request.body}`;
    const variables = reqResObj.request.bodyVariables ? JSON.parse(reqResObj.request.bodyVariables) : {};

    if (reqResObj.request.method === 'QUERY') {
      client.query({ query: body, variables })
        .then(data => this.handleCookiesAndResponse(data, reqResObj))
        .catch((err) => {
          console.error(err);
        });
      }
      else if (reqResObj.request.method === 'MUTATION') {
        client.mutate({ mutation: body, variables })
        .then(data => this.handleCookiesAndResponse(data, reqResObj))
        .catch((err) => {
          console.error(err);
        });
    }
  },

  openSubscription(reqResObj) {
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'open';
    store.default.dispatch(actions.reqResUpdate(reqResObj));
    // TODO - needs built out
    
    const wsLink = new createHttpLink({
      uri: `http://localhost:8000/graphql`,
      options: {
        reconnect: true
      }
    });

    const client = new ApolloClient({
      link: wsLink,
      cache: new InMemoryCache(),
    })
    
    client.subscribe({
      query: gql`
      subscription {
        messageCreated {
          content
        }
      }
      `
    }).subscribe({
      next(data) {
        console.log('DATA', data);
      }
    })
  },

  handleCookiesAndResponse(data, reqResObj) {
    // getting all current cookies for request and response
    session.defaultSession.cookies.get({}, (error, result) => {
      // removing request cookies, leaving only response cookies
      const cookies = result.filter((cookie) => {
        let match = false;
        if (reqResObj.request.cookies.length) {
          for (let reqCookie of reqResObj.request.cookies) {
            if (reqCookie.key === cookie.name && reqCookie.value === cookie.value) match = true;
          }
        }
        if (!match) return cookie;
      });
      // update reqResObj with only response cookies
      reqResObj.response.cookies.push(...cookies);
      // removing request and response cookies every request in application storage
      result.forEach(cookie => {
        session.defaultSession.cookies.remove('http://localhost:8080', cookie.name, (data) => {
          console.log(data);
        })
      });
      // call to set state with updated reqResObj
      this.handleResponse(data, reqResObj);
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
  }
};

export default graphQLController;