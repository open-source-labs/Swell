import ApolloClient, { OperationVariables } from 'apollo-client';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { buildClientSchema, printSchema, IntrospectionQuery } from 'graphql';
import * as store from '../store';
import * as actions from '../actions/actions';
import { NewRequestResponseObject, GraphQLResponseObject, GraphQLResponseObjectData, CookieObject, NewRequestHeaders, NewRequestCookies, WindowAPIObject, WindowExt } from '../../types';

const { api }: { api: WindowAPIObject } = window as WindowExt;

const graphQLController = {
  openGraphQLConnection(reqResObj: NewRequestResponseObject): void {
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
        if (response.error)
          this.handleError(response.reqResObj.error, response.reqResObj);
        else this.handleResponse(response.data, response.reqResObj);
      })
      .catch((err) => console.log('error in sendGqlToMain', err));
  },

  openGraphQLConnectionAndRunCollection(reqResArray: NewRequestResponseObject[]): void {
    // initialize response data
    let index = 0;
    const reqResObj = reqResArray[index]; //-> this seems erroneous -Prince
    api.removeAllListeners('reply-gql');
    api.receive('reply-gql', (result: GraphQLResponseObject) => {
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

    const runSingleGraphQLRequest = (reqResObj: NewRequestResponseObject) => {
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
  sendGqlToMain(args: Record<string, NewRequestResponseObject>): Promise<GraphQLResponseObject> {
    return new Promise((resolve) => {
      // send object to the context bridge
      api.removeAllListeners('reply-gql');
      api.send('open-gql', args);
      api.receive('reply-gql', (result: GraphQLResponseObject) => {
        // needs formatting because component reads them in a particular order
        result.reqResObj.response.cookies = this.cookieFormatter(
          result.reqResObj.response.cookies
        );
        resolve(result);
      });
    });
  },

  openSubscription(reqResObj: NewRequestResponseObject): void {
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
    const headers: Record<string, string> = {};
    reqResObj.request.headers.forEach(({
      active,
      key,
      value
    }: NewRequestHeaders) => {
    
      if (active) headers[key] = value;
    });

    // Reformat cookies
    let cookiesStr = '';
    if (reqResObj.request.cookies.length) {
      cookiesStr = reqResObj.request.cookies.reduce((acc: string, userCookie: NewRequestCookies) => {
        if (userCookie.active)
          return `${acc}${userCookie.key}=${userCookie.value}; `;
        return acc;
      }, '');
    }
    headers.Cookie = cookiesStr;

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

    const variables: OperationVariables = reqResObj.request.bodyVariables
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
          const newReqRes: NewRequestResponseObject = JSON.parse(JSON.stringify(reqResObj));
          store.default.dispatch(actions.saveCurrentResponseData(newReqRes));
          store.default.dispatch(actions.reqResUpdate(newReqRes));
        },
        error(err) {
          console.error(err);
        },
      });
  },

  handleResponse(response: GraphQLResponseObject, reqResObj: NewRequestResponseObject): void {
    reqResObj.connection = 'closed';
    reqResObj.connectionType = 'plain';
    reqResObj.timeReceived = Date.now();

    reqResObj.response.events.push(response.data);

    store.default.dispatch(actions.reqResUpdate(reqResObj));
    store.default.dispatch(actions.saveCurrentResponseData(reqResObj));
    store.default.dispatch(actions.updateGraph(reqResObj));
  },

  handleError(errorsObj: string, reqResObj: NewRequestResponseObject): void {
    reqResObj.connection = 'error';
    reqResObj.timeReceived = Date.now();

    reqResObj.response.events.push(JSON.parse(errorsObj));
    store.default.dispatch(actions.saveCurrentResponseData(reqResObj));
    store.default.dispatch(actions.reqResUpdate(reqResObj));
  },

  // objects that travel over IPC API have their properties alphabetized...
  cookieFormatter(cookieArray: CookieObject[]): CookieObject[] {
    return cookieArray.map((eachCookie: CookieObject) => {
      const cookieFormat = {
        name: eachCookie.name,
        value: eachCookie.value,
        domain: eachCookie.domain,
        hostOnly: eachCookie.hostOnly ? eachCookie.hostOnly : false,
        path: eachCookie.path,
        secure: eachCookie.secure ? eachCookie.secure : false,
        httpOnly: eachCookie.httpOnly ? eachCookie.httpOnly : false,
        session: eachCookie.session ? eachCookie.session : false,
        expires: eachCookie.expires ? eachCookie.expires : '',
      };
      return cookieFormat;
    });
  },

  introspect(url: string, headers: NewRequestHeaders[], cookies: NewRequestCookies[]): void {
    const introspectionObject = {
      url,
      headers,
      cookies,
    };
    api.send('introspect', JSON.stringify(introspectionObject));
    api.receive('introspect-reply', (data: IntrospectionQuery) => {
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
