import ApolloClient from 'apollo-client';
import { InMemoryCache, ApolloLink } from 'apollo-boost';
import gql from 'graphql-tag';
import { createHttpLink } from 'apollo-link-http';

import * as store from '../store';
import * as actions from '../actions/actions';

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
      // console.log('data in handle response', data);
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

    // adding createHttpLink to get headers..?
    const httpLink = createHttpLink({
      uri: reqResObj.url,
    });

    /*
    'Afterware' is very similar to a middleware, except that an afterware runs after a request has been made, that is when a response is going to get processed.

    See here for more information on this code: https://github.com/apollographql/apollo-link/issues/373
    */
    // const afterwareLink = new ApolloLink((operation, forward) => {
    // console.log('forward(operation)', forward(operation));
    // return forward(operation).map((response) => {
    //   console.log('response', response);
    //   const resultOfGetContext = operation.getContext();
    //   console.log('resultOfGetContext', resultOfGetContext);
    //   const { response: { headers } } = resultOfGetContext;
    //   console.log('headers', headers);
    //   for (const header of headers.entries()) {
    //     console.log('inside the entries iterator', header);
    //   }
    //   headers.forEach((item) => {
    //     console.log('this is a header', item);
    //   });
    //   return response;
    // });
    // });

    const client = new ApolloClient({
      // link: afterwareLink.concat(httpLink),
      link: httpLink,
      headers,
      credentials: 'same-origin',
      cache: new InMemoryCache(),
    });
    //Possible implementation of variables
    // graphql(body, {
    //   name : body,
    //   options: (ownProps) => ({
    //     variables: {
    //       reqResObj.request.bodyVariables
    //     }
    //   })
    // Query specific implementation
    if (reqResObj.request.method === 'QUERY') {
      if(reqResObj.request.bodyVariables){
        client.query({ query: body, variables:JSON.parse(reqResObj.request.bodyVariables) })
          // Update the store with the response
          .then(data => handleResponse(data))
          .catch((err) => {
            console.error(err);
            reqResObj.connection = 'error';
            store.default.dispatch(actions.reqResUpdate(reqResObj));
          });
      }else{
        client.query({ query: body })
          // Update the store with the response
          .then(data => handleResponse(data))
          .catch((err) => {
            console.error(err);
            reqResObj.connection = 'error';
            store.default.dispatch(actions.reqResUpdate(reqResObj));
          });

      }
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
