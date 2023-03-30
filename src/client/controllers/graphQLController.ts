import {
  ApolloClient,
  OperationVariables,
  InMemoryCache,
} from '@apollo/client';
import gql from 'graphql-tag';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { buildClientSchema, printSchema, IntrospectionQuery } from 'graphql';

import {
  ReqRes,
  GraphQLResponse,
  Cookie,
  CookieOrHeader,
  WindowExt,
} from '../../types';

import Store from '../toolkit-refactor/store';
import { appDispatch } from '../toolkit-refactor/store';
import { introspectionDataChanged } from '../toolkit-refactor/introspectionData/introspectionDataSlice';
import {
  responseDataSaved,
  reqResUpdated,
} from '../toolkit-refactor/reqRes/reqResSlice';
import { graphUpdated } from '../toolkit-refactor/graphPoints/graphPointsSlice';

const { api } = window as unknown as WindowExt;

interface GqlController {
  subscriptions: { [key: string]: any };
  openGraphQLConnection: (reqResObj: ReqRes) => void;
  openGraphQLConnectionAndRunCollection: (reqResArray: ReqRes[]) => void;
  sendGqlToMain: (args: Record<string, ReqRes>) => Promise<GraphQLResponse>;
  openSubscription: (reqResObj: ReqRes) => void;
  closeSubscription: (reqResObj: ReqRes) => void;
  handleResponse: (response: GraphQLResponse, reqResObj: ReqRes) => void;
  handleError: (errorsObj: string, reqResObj: ReqRes) => void;
  cookieFormatter: (cookieArray: Cookie[]) => Cookie[];
  introspect: (
    url: string,
    headers: CookieOrHeader[],
    cookies: CookieOrHeader[]
  ) => void;
}

const graphQLController: GqlController = {
  subscriptions: {},

  openGraphQLConnection(reqResObj: ReqRes): void {
    // initialize response data
    reqResObj = {
      ...reqResObj,
      response: {
        ...reqResObj.response,
      },
    };
    console.log(reqResObj);
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.response.cookies = [];
    reqResObj.connection = 'open';
    reqResObj.timeSent = Date.now();
    // dispatch(updated(reqResObj));
    // send reqRes object to main process through context bridge
    this.sendGqlToMain({ reqResObj })
      .then((response) => {
        if (response.error)
          this.handleError(response.reqResObj.error, response.reqResObj);
        else this.handleResponse(response.data, response.reqResObj);
      })
      .catch((err) => console.log('error in sendGqlToMain', err));
  },

  openGraphQLConnectionAndRunCollection(reqResArray: ReqRes[]): void {
    // initialize response data
    let index = 0;
    const reqResObj = reqResArray[index]; //-> this seems erroneous -Prince
    api.removeAllListeners('reply-gql');
    api.receive('reply-gql', (result: GraphQLResponse) => {
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

        appDispatch(reqResUpdated(result.reqResObj));
        appDispatch(responseDataSaved(result.reqResObj));

        appDispatch(graphUpdated(result.reqResObj));
        index += 1;
        if (reqResArray.length > index)
          runSingleGraphQLRequest(reqResArray[index]);
      }
    });

    const runSingleGraphQLRequest = (reqResObj: ReqRes) => {
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
  sendGqlToMain(args: Record<string, ReqRes>): Promise<GraphQLResponse> {
    return new Promise((resolve) => {
      // send object to the context bridge
      api.removeAllListeners('reply-gql');
      api.send('open-gql', args);
      api.receive('reply-gql', (result: GraphQLResponse) => {
        // needs formatting because component reads them in a particular order
        result.reqResObj.response.cookies = this.cookieFormatter(
          result.reqResObj.response.cookies
        );
        resolve(result);
      });
    });
  },

  // open communication from server to client using websocket
  openSubscription(reqResObj: ReqRes): void {
    console.log('openSubscription');
    // have to replace http with ws to connect to the websocket
    const wsUri = reqResObj.url.replace(/http/gi, 'ws');

    // Map all headers to headers object
    const headers: Record<string, string> = {};
    reqResObj.request.headers.forEach(
      ({ active, key, value }: CookieOrHeader) => {
        if (active) headers[key] = value;
      }
    );

    // Reformat cookies
    let cookiesStr = '';
    if (reqResObj.request.cookies.length) {
      cookiesStr = reqResObj.request.cookies.reduce(
        (acc: string, userCookie: CookieOrHeader) => {
          if (userCookie.active)
            return `${acc}${userCookie.key}=${userCookie.value}; `;
          return acc;
        },
        ''
      );
    }
    headers.Cookie = cookiesStr;

    // create websocket client
    const wsLink = new GraphQLWsLink(
      createClient({
        url: wsUri,
        connectionParams: {
          headers,
          timeout: 30000,
          reconnect: true,
        },
      })
    );
    // create apollo client
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

    const subscription = apolloClient
      .subscribe({
        query,
        variables,
      })
      .subscribe({
        next(subsEvent) {
          // Notify your application with the new arrived data
          console.log('new link', subsEvent.data);
          const existingSub: ReqRes =
            Store.getState().reqRes.reqResArray.find(
              (entry) => entry.id === reqResObj.id
            ) || reqResObj;
          const newReqRes: ReqRes = JSON.parse(
            JSON.stringify({
              ...existingSub,
              response: {
                ...existingSub.response,
                events: existingSub.response.events
                  ? [...existingSub.response.events, subsEvent.data]
                  : [subsEvent.data],
              },
              connection: 'open',
            })
          );
          appDispatch(responseDataSaved(newReqRes));
          appDispatch(reqResUpdated(newReqRes));
        },
        error(err) {
          const newReqRes: ReqRes = {
            ...reqResObj,
            connection: 'error',
            error: err,
            response: {
              ...reqResObj.response,
              events: [err],
            },
          };
          appDispatch(responseDataSaved(newReqRes));
          appDispatch(reqResUpdated(newReqRes));
          console.error(err);
        },
      });

    this.subscriptions[reqResObj.id] = subscription;

    const newReqRes: ReqRes = { ...reqResObj, connection: 'open' };
    appDispatch(reqResUpdated(newReqRes));

    const currentID = Store.getState().reqRes.currentResponse.id;
    if (currentID === reqResObj.id) appDispatch(responseDataSaved(newReqRes));
  },

  closeSubscription(reqResObj: ReqRes): void {
    const { id } = reqResObj;
    if (this.subscriptions[id]) {
      this.subscriptions[id].unsubscribe();
      delete this.subscriptions[id];
      console.log('Unsubscribed successfully.');
    } else {
      console.warn('Cannot find subscription to unsubscribe.');
    }
  },

  handleResponse(response: GraphQLResponse, reqResObj: ReqRes): void {
    reqResObj.connection = 'closed';
    reqResObj.connectionType = 'plain';
    reqResObj.timeReceived = Date.now();

    reqResObj.response.events.push(response.data);

    appDispatch(reqResUpdated(reqResObj));
    appDispatch(responseDataSaved(reqResObj));
    appDispatch(graphUpdated(reqResObj));
  },

  handleError(errorsObj: string, reqResObj: ReqRes): void {
    reqResObj.connection = 'error';
    reqResObj.timeReceived = Date.now();

    reqResObj.response.events.push(JSON.parse(errorsObj));
    appDispatch(responseDataSaved(reqResObj));
    appDispatch(reqResUpdated(reqResObj));
  },

  // objects that travel over IPC API have their properties alphabetized...
  cookieFormatter(cookieArray: Cookie[]): Cookie[] {
    return cookieArray.map((eachCookie: Cookie) => {
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

  introspect(
    url: string,
    headers: CookieOrHeader[],
    cookies: CookieOrHeader[]
  ): void {
    const introspectionObject = {
      url,
      headers,
      cookies,
    };
    api.send('introspect', JSON.stringify(introspectionObject));
    api.receive('introspect-reply', (data: IntrospectionQuery) => {
      console.log(data);
      if (data !== 'Error: Please enter a valid GraphQL API URI') {
        // formatted for Codemirror hint and lint
        const clientSchema = buildClientSchema(data);
        // formatted for pretty schema display
        const schemaSDL = printSchema(clientSchema);
        const modifiedData = { schemaSDL, clientSchema };

        appDispatch(introspectionDataChanged(modifiedData));
      } else {
        appDispatch(introspectionDataChanged(data));
      }
    });
  },
};

export default graphQLController;
