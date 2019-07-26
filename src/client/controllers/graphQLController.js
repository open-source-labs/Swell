import store from "../store";
import * as actions from '../actions/actions';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const graphQLController = {
  openGraphQLConnection(reqResObj, connectionArray) {
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();

    /*
    TODO: Investigate this code from httpController
    
    store.default.dispatch(actions.reqResUpdate(reqResObj));

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
      .then(data => console.log('response from query', data))
      .catch(err => console.error(err));

  }
};

export default graphQLController;
