import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import * as store from "../store";
import * as actions from "../actions/actions";

const { api } = window;

const graphQLController = {
  openGraphQLConnection(reqResObj) {
    console.log('in graphQL connection')
    // initialize response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.response.cookies = [];
    reqResObj.connection = "open";
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    this.sendGqlToMain({ reqResObj }).then((response) => {
      response.error
        ? this.handleError(response.error, response.reqResObj)
        : this.handleResponse(response.data, response.reqResObj);
    }).catch( err => console.log("error in sendGqlToMain", err));
  },

  // handles graphQL queries and mutationsnp
  sendGqlToMain(args) {
    console.log('in sendGqlToMain');
    return new Promise((resolve) => {
      api.send("open-gql", args);
      api.receive("reply-gql", (result) => {
        console.log("This is result:", result);
        // needs formatting because component reads them in a particular order
        result.reqResObj.response.cookies = this.cookieFormatter(
          result.reqResObj.response.cookies
        );
        console.log('2nd Results', result);
        resolve(result);
      });
      // api.send("open-gql", args);
    });
  },

  openSubscription(reqResObj) {
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = "open";
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    const wsUri = reqResObj.url;
    const wsClient = new SubscriptionClient(wsUri, { reconnect: true });
    const wsLink = new WebSocketLink(wsClient);

    const apolloClient = new ApolloClient({
      link: wsLink,
      cache: new InMemoryCache(),
    });

    const query = gql`
      ${reqResObj.request.body}
    `;
    const variables = reqResObj.request.bodyVariables
      ? JSON.parse(reqResObj.request.bodyVariables)
      : {};

    apolloClient
      .subscribe({
        query,
        variables,
      })
      .subscribe({
        next(subsEvent) {
          // Notify your application with the new arrived data
          reqResObj.response.events.push(JSON.stringify(subsEvent.data));
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        },
      });
  },

  handleResponse(response, reqResObj) {
    console.log('inside handleResponse gqlController');
    reqResObj.connection = "closed";
    reqResObj.connectionType = "plain";
    reqResObj.timeReceived = Date.now();
    reqResObj.response.events.push(JSON.stringify(response.data));
    store.default.dispatch(actions.reqResUpdate(reqResObj));
  },

  handleError(errorsObj, reqResObj) {
    console.log('in handleError');
    reqResObj.connection = "error";
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
        expriationDate: eachCookie.expires ? eachCookie.expires : "",
      };
      return cookieFormat;
    });
  },
};

export default graphQLController;
