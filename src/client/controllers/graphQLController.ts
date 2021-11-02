import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { buildClientSchema, printSchema } from 'graphql';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../s... Remove this comment to see the full error message
import * as store from '../store';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../a... Remove this comment to see the full error message
import * as actions from '../actions/actions';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Window & ty... Remove this comment to see the full error message
const { api } = window;

const graphQLController = {
  openGraphQLConnection(reqResObj: any) {
    // initialize response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.response.cookies = [];
    reqResObj.connection = 'open';
    reqResObj.timeSent = Date.now();
    // store.default.dispatch(actions.reqResUpdate(reqResObj));
    // send reqRes object to main process through context bridge
    this.sendGqlToMain({ reqResObj })
      .then((response) => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        if (response.error)
          // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
          this.handleError(response.reqResObj.error, response.reqResObj);
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        else this.handleResponse(response.data, response.reqResObj);
      })
      .catch((err) => console.log('error in sendGqlToMain', err));
  },

  openGraphQLConnectionAndRunCollection(reqResArray: any) {
    // initialize response data
    let index = 0;
    const reqResObj = reqResArray[index];
    api.removeAllListeners('reply-gql');
    api.receive('reply-gql', (result: any) => {
      // needs formatting because component reads them in a particular order
      result.reqResObj.response.cookies = this.cookieFormatter(
        result.reqResObj.response.cookies
      );

      if (result.error) {
        this.handleError(result.error, result.reqResObj);
      } else {
        result.reqResObj.response.events.push(result.data);

        result.reqResObj.connection = 'closed';
        result.reqResObj.connectionType = 'plain';
        result.reqResObj.timeReceived = Date.now();

        store.default.dispatch(actions.reqResUpdate(result.reqResObj));
        store.default.dispatch(
          actions.saveCurrentResponseData(result.reqResObj)
        );
        store.default.dispatch(actions.updateGraph(result.reqResObj));
        index += 1;
        if (reqResArray.length > index)
          runSingleGraphQLRequest(reqResArray[index]);
      }
    });

    const runSingleGraphQLRequest = (reqResObj: any) => {
      reqResObj.response.headers = {};
      reqResObj.response.events = [];
      reqResObj.response.cookies = [];
      reqResObj.connection = 'open';
      reqResObj.timeSent = Date.now();
      api.send('open-gql', { reqResObj });
    };
    runSingleGraphQLRequest(reqResArray[index]);
  },

  // handles graphQL queries and mutations
  sendGqlToMain(args: any) {
    return new Promise((resolve) => {
      // send object to the context bridge
      api.removeAllListeners('reply-gql');
      api.send('open-gql', args);
      api.receive('reply-gql', (result: any) => {
        // needs formatting because component reads them in a particular order
        result.reqResObj.response.cookies = this.cookieFormatter(
          result.reqResObj.response.cookies
        );
        resolve(result);
      });
    });
  },

  openSubscription(reqResObj: any) {
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'open';
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    const currentID = store.default.getState().business.currentResponse.id;
    if (currentID === reqResObj.id)
      store.default.dispatch(actions.saveCurrentResponseData(reqResObj));

    // have to replace http with ws to connect to the websocket
    const wsUri = reqResObj.url.replace(/http/gi, 'ws');

    // Map all headers to headers object
    const headers = {};
    reqResObj.request.headers.forEach(({
      active,
      key,
      value
    }: any) => {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (active) headers[key] = value;
    });

    // Reformat cookies
    let cookies = '';
    if (reqResObj.request.cookies.length) {
      cookies = reqResObj.request.cookies.reduce((acc: any, userCookie: any) => {
        if (userCookie.active)
          return `${acc}${userCookie.key}=${userCookie.value}; `;
        return acc;
      }, '');
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'Cookie' does not exist on type '{}'.
    headers.Cookie = cookies;

    const wsLink = new WebSocketLink(
      new SubscriptionClient(wsUri, {
        reconnect: true,
        timeout: 30000,
        connectionParams: {
          headers,
        },
      })
    );

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
          reqResObj.response.events.push(subsEvent.data);
          const newReqRes = JSON.parse(JSON.stringify(reqResObj));
          store.default.dispatch(actions.saveCurrentResponseData(newReqRes));
          store.default.dispatch(actions.reqResUpdate(newReqRes));
        },
        error(err) {
          console.error(err);
        },
      });
  },

  handleResponse(response: any, reqResObj: any) {
    reqResObj.connection = 'closed';
    reqResObj.connectionType = 'plain';
    reqResObj.timeReceived = Date.now();

    reqResObj.response.events.push(response.data);

    store.default.dispatch(actions.reqResUpdate(reqResObj));
    store.default.dispatch(actions.saveCurrentResponseData(reqResObj));
    store.default.dispatch(actions.updateGraph(reqResObj));
  },

  handleError(errorsObj: any, reqResObj: any) {
    reqResObj.connection = 'error';
    reqResObj.timeReceived = Date.now();

    reqResObj.response.events.push(JSON.parse(errorsObj));
    store.default.dispatch(actions.saveCurrentResponseData(reqResObj));
    store.default.dispatch(actions.reqResUpdate(reqResObj));
  },

  // objects that travel over IPC API have their properties alphabetized...
  cookieFormatter(cookieArray: any) {
    return cookieArray.map((eachCookie: any) => {
      const cookieFormat = {
        name: eachCookie.name,
        value: eachCookie.value,
        domain: eachCookie.domain,
        hostOnly: eachCookie.hostonly ? eachCookie.hostonly : false,
        path: eachCookie.path,
        secure: eachCookie.secure ? eachCookie.secure : false,
        httpOnly: eachCookie.httponly ? eachCookie.httponly : false,
        session: eachCookie.session ? eachCookie.session : false,
        expirationDate: eachCookie.expires ? eachCookie.expires : '',
      };
      return cookieFormat;
    });
  },

  introspect(url: any, headers: any, cookies: any) {
    const introspectionObject = {
      url,
      headers,
      cookies,
    };
    api.send('introspect', JSON.stringify(introspectionObject));
    api.receive('introspect-reply', (data: any) => {
      if (data !== 'Error: Please enter a valid GraphQL API URI') {
        // formatted for Codemirror hint and lint
        const clientSchema = buildClientSchema(data);
        // formatted for pretty schema display
        const schemaSDL = printSchema(clientSchema);
        const modifiedData = { schemaSDL, clientSchema };
        store.default.dispatch(actions.setIntrospectionData(modifiedData));
      } else {
        store.default.dispatch(actions.setIntrospectionData(data));
      }
    });
  },
};

export default graphQLController;
