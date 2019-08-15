import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import * as store from '../store';
import * as actions from '../actions/actions';
import { ApolloLink } from 'apollo-link';


const graphQLController = {

  openGraphQLConnection(reqResObj) {
    console.warn(reqResObj)
    // initialize response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'open';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    // TODO: Add request cookies
    const headers = {};
    reqResObj.request.headers.forEach((item) => {
      headers[item.key] = item.value;
    });

    const httpLink = createHttpLink({ uri: reqResObj.url });
    const middlewareLink = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          authorization: localStorage.getItem('token') || null
        }
      });
      return forward(operation)
    }) 
    
    const client = new ApolloClient({
      link: middlewareLink.concat(httpLink),
      credentials: 'same-origin',
      cache: new InMemoryCache(),
    });
    console.log(client,'**********8888888888888888888')
    const body = gql`${reqResObj.request.body}`;
    const variables = reqResObj.request.bodyVariables ? JSON.parse(reqResObj.request.bodyVariables) : {};

    if (reqResObj.request.method === 'QUERY') {
      client.query({ query: body, variables })
        // Update the store with the response
        .then(data => {
          console.log({body, variables})
          return this.handleResponse(data, reqResObj)
        })
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
    console.log(response, reqResObj)
    const reqResCopy = JSON.parse(JSON.stringify(reqResObj));
    // TODO: Add response headers, cookies
    reqResCopy.connection = 'closed';
    reqResCopy.connectionType = 'plain';
    reqResCopy.timeReceived = Date.now();
    // console.log("reqResCopy",reqResCopy)
    reqResCopy.response.events.push(JSON.stringify(response.data));
    // reqResCopy.response.headers = "HI";
    store.default.dispatch(actions.reqResUpdate(reqResCopy));
  },
};

export default graphQLController;
