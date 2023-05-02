import ReqResCtrl from '../../src/client/controllers/reqResController';

/**
 * @todo Integration tests with the actual API. The controller calls api.send
 * and api.recieve without attachement to the API, the tests in this file don't
 * perform anything.
 *
 * Additionally, add a testing file for graphQLController. This is currently
 * untested and is a dependency for reqResController.
 *
 * @todo Refactor for new state structure with redux slices
 */

describe('REST API Requests', () => {
  let state;
  beforeEach(() => {
    state = {
      currentTab: 'First Tab',
      reqResArray: [],
      history: [],
      collections: [],
      warningMessage: {},
      newRequestFields: {
        protocol: '',
        restUrl: 'http://',
        wsUrl: 'ws://',
        gqlUrl: 'https://',
        grpcUrl: '',
        url: 'http://',
        method: 'GET',
        graphQL: false,
        gRPC: false,
        network: 'rest',
      },
      newRequestHeaders: {
        headersArr: [],
        count: 0,
      },
      newRequestStreams: {
        streamsArr: [],
        count: 0,
        streamContent: [],
        selectedPackage: null,
        selectedRequest: null,
        selectedService: null,
        selectedServiceObj: null,
        selectedStreamingType: null,
        initialQuery: null,
        queryArr: null,
        protoPath: null,
        services: null,
        protoContent: '',
      },
      newRequestCookies: {
        cookiesArr: [],
        count: 0,
      },
      newRequestBody: {
        bodyContent: '',
        bodyVariables: '',
        bodyType: 'raw',
        rawType: 'text/plain',
        JSONFormatted: true,
        bodyIsNew: false,
      },
      newRequestSSE: {
        isSSE: false,
      },
      introspectionData: { schemaSDL: null, clientSchema: null },
      graphPoints: [],
      currentResponse: {
        request: {
          network: '',
        },
      },
    };
  });

  describe('public API', () => {
    xit('it should GET information from a public API', () => {
      // define request
      const request = {
        id: 'testID',
        // createdAt: 2020-11-04T19:33:55.829Z,
        protocol: 'http://',
        host: 'http://jsonplaceholder.typicode.com',
        path: '/posts',
        url: 'http://jsonplaceholder.typicode.com/posts',
        graphQL: false,
        gRPC: false,
        timeSent: null,
        timeReceived: null,
        connection: 'uninitialized',
        connectionType: null,
        checkSelected: false,
        protoPath: null,
        request: {
          method: 'GET',
          headers: [[Object]],
          cookies: [],
          body: '',
          bodyType: 'raw',
          bodyVariables: '',
          rawType: 'text/plain',
          isSSE: false,
          network: 'rest',
          restUrl: 'http://jsonplaceholder.typicode.com/posts',
          wsUrl: 'ws://',
          gqlUrl: 'https://',
          grpcUrl: '',
        },
        response: { headers: null, events: null },
        checked: false,
        minimized: false,
        tab: 'First Tab',
      };

      state = ReqResCtrl.openReqRes(request);
      const response = state.reqResArray[0];
      console.log(response);
      expect(response.status).toEqual(200);
      // expect(response.toEqual('hello'));
    });

    it('should toggle select all', () => {
      expect(ReqResCtrl.toggleSelectAll()).not.toThrowError;
    });
  });
});
