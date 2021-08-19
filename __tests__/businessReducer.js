import reducer from '../src/client/reducers/business';

describe('Business reducer', () => {
  let state;
  beforeEach(() => {
    state = {
      currentTab: 'First Tab',
      reqResArray: [],
      scheduledReqResArray: [],
      history: [],
      collections: [],
      warningMessage: {},
      newRequestsOpenAPI: {
        openapiMetadata: {
          info: {},
          tags: [],
          serverUrls: [],
        },
        openapiReqArray: [],
      },
      newRequestFields: {
        protocol: '',
        restUrl: 'http://',
        wsUrl: 'ws://',
        gqlUrl: 'https://',
        grpcUrl: '',
        webrtcUrl: '',
        url: 'http://',
        method: 'GET',
        graphQL: false,
        gRPC: false,
        ws: false,
        openapi: false,
        webrtc: false,
        network: 'rest',
        testContent: '',
        testResults: [],
        openapiReqObj: {},
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
      newRequestOpenAPIObject: {
        request: {
          id: 0,
          enabled: true,
          reqTags: [],
          reqServers: [],
          summary: '',
          description: '',
          operationId: '',
          method: '',
          endpoint: '',
          headers: {},
          parameters: [],
          body: new Map(),
          urls: [],
        },
      },
      introspectionData: { schemaSDL: null, clientSchema: null },
      dataPoints: {},
      currentResponse: {
        request: {
          network: '',
        },
      },
    };
  });

  describe('default state', () => {
    it('should return a default state when given an undefined input', () => {
      expect(reducer(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe('unrecognized action types', () => {
    it('should return the original without any duplication', () => {
      const action = { type: 'aajsbicawlbejckr' };
      expect(reducer(state, action)).toBe(state);
    });
  });

  describe('GET_HISTORY', () => {
    const fakeHistory = [
      {
        date: '02/15/2019',
        history: [
          {
            id: 'd79d8f1a-f53c-41a1-a7e3-514f9f5cf24e',
            created_at: '2019-02-15T21:40:44.132Z',
          },
          {
            id: 'c8d73eec-e383-4735-943a-20deab42ecff',
            created_at: '2019-02-15T20:52:35.990Z',
          },
        ],
      },
      {
        date: '02/14/2019',
        history: [
          {
            id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
            created_at: '2019-02-15T00:40:56.360Z',
          },
          {
            id: '577eab93-e707-4dc0-af45-7adcc78807fa',
            created_at: '2019-02-15T00:16:56.133Z',
          },
        ],
      },
    ];

    const action = {
      type: 'GET_HISTORY',
      payload: fakeHistory,
    };

    it('should update history in state', () => {
      const { reqResArray, history } = reducer(state, action);
      expect(reqResArray).toEqual([]);
      expect(history).toEqual(fakeHistory);
    });
  });

  describe('DELETE_HISTORY', () => {
    const fakeHistory = [
      {
        date: '02/15/2019',
        history: [
          {
            id: 'c8d73eec-e383-4735-943a-20deab42ecff',
            created_at: '2019-02-15T20:52:35.990Z',
          },
        ],
      },
      {
        date: '02/14/2019',
        history: [
          {
            id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
            created_at: '2019-02-15T00:40:56.360Z',
          },
          {
            id: '577eab93-e707-4dc0-af45-7adcc78807fa',
            created_at: '2019-02-15T00:16:56.133Z',
          },
        ],
      },
    ];

    beforeEach(() => {
      state.history = fakeHistory;
    });

    it('should delete the proper history', () => {
      const action = {
        type: 'DELETE_HISTORY',
        payload: {
          id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
          created_at: '2019-02-15T00:40:56.360Z',
        },
      };

      const { history } = reducer(state, action);
      expect(history).not.toBe(fakeHistory);
      expect(history[1].history.length).toEqual(1);
      expect(history[1].history[0].id).toBe(
        '577eab93-e707-4dc0-af45-7adcc78807fa'
      );
    });

    it('should remove date array if empty', () => {
      const action = {
        type: 'DELETE_HISTORY',
        payload: {
          id: 'c8d73eec-e383-4735-943a-20deab42ecff',
          created_at: '2019-02-15T20:52:35.990Z',
        },
      };
      const initialHistory = state.history;
      const { history } = reducer(state, action);
      expect(history).not.toBe(initialHistory);
      expect(initialHistory.length).toBe(2);
      expect(history.length).toBe(1);
    });
  });

  describe('REQRES_CLEAR', () => {
    const action = {
      type: 'REQRES_CLEAR',
    };

    it('should empty the reqResArray', () => {
      const initialReqResArray = [{ first: 1 }, { second: 2 }];
      // state.reqResArray = initialReqResArray;
      // expect(state.reqResArray).toBe(initialReqResArray); //unnecessary...?
      const { reqResArray } = reducer(state, action);
      expect(reqResArray).not.toBe(initialReqResArray);
      expect(reqResArray).toEqual([]);
    });
  });

  describe('REQRES_ADD', () => {
    const fakeReqRes1 = {
      id: 'd79d8f1a-f53c-41a1-a7e3-514f9f5cf24e',
      created_at: '2019-02-15T21:40:44.132Z',
      protocol: 'http://',
      request: { method: 'POST', body: 'I am a request body' },
      response: {},
    };

    const fakeReqRes2 = {
      id: 'c8d73eec-e383-4735-943a-20deab42ecff',
      created_at: '2019-02-16T20:52:35.990Z',
      protocol: 'http://',
      request: { method: 'POST', body: 'I am a newer request body' },
      response: {},
    };

    const action1 = {
      type: 'REQRES_ADD',
      payload: fakeReqRes1,
    };

    const action2 = {
      type: 'REQRES_ADD',
      payload: fakeReqRes2,
    };

    it('should add the reqRes to reqResArray', () => {
      const initialReqResArray = state.reqResArray;
      const { reqResArray } = reducer(state, action1);
      expect(reqResArray).not.toEqual(initialReqResArray);
      expect(reqResArray.length).toEqual(1);
      expect(reqResArray[0]).toEqual(fakeReqRes1);
      expect(reqResArray[0].request.body).toEqual('I am a request body');
    });

    it('should add the reqRes to the history', () => {
      const firstState = reducer(state, action1);
      expect(firstState.history.length).toEqual(1);
      const { history } = reducer(firstState, action2);
      expect(history.length).toEqual(2);
      expect(history[0].date).toEqual('02/16/2019');
      expect(history[1].date).toEqual('02/15/2019');
    });
  });

  describe('REQRES_DELETE', () => {
    const fakeReqResArray = [
      {
        id: 'c8d73eec-e383-4735-943a-20deab42ecff',
        created_at: '2019-02-15T20:52:35.990Z',
      },
      {
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        created_at: '2019-02-15T00:40:56.360Z',
      },
      {
        id: '577eab93-e707-4dc0-af45-7adcc78807fa',
        created_at: '2019-02-15T00:16:56.133Z',
      },
    ];

    const action = {
      type: 'REQRES_DELETE',
      payload: fakeReqResArray[1],
    };

    it('should delete a reqRes from reqResArray', () => {
      const initialReqResArray = state.reqResArray;
      state.reqResArray = fakeReqResArray;
      const { reqResArray } = reducer(state, action);
      expect(reqResArray).not.toBe(initialReqResArray);
      expect(reqResArray.length).toEqual(2);
      expect(reqResArray[0]).toEqual(fakeReqResArray[0]);
      expect(reqResArray[1]).toEqual(fakeReqResArray[2]);
    });
  });

  describe('REQRES_UPDATE', () => {
    const fakeReqResArray = [
      {
        id: 'c8d73eec-e383-4735-943a-20deab42ecff',
        created_at: '2019-02-15T20:52:35.990Z',
      },
      {
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        created_at: '2019-02-15T00:40:56.360Z',
      },
      {
        id: '577eab93-e707-4dc0-af45-7adcc78807fa',
        created_at: '2019-02-15T00:16:56.133Z',
      },
    ];

    const action = {
      type: 'REQRES_UPDATE',
      payload: {
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        created_at: '2018-02-15T00:40:56.360Z',
        newKey: 'this is a new value',
      },
    };

    it('should update a reqRes from reqResArray', () => {
      const initialReqResArray = state.reqResArray;
      state.reqResArray = fakeReqResArray;
      const { reqResArray } = reducer(state, action);
      expect(reqResArray).not.toBe(initialReqResArray);
      expect(reqResArray.length).toEqual(3);
      expect(reqResArray[1]).toEqual(action.payload);
      expect(reqResArray[0]).toEqual(fakeReqResArray[0]);
      expect(reqResArray[2]).toEqual(fakeReqResArray[2]);
    });
  });

  describe('SET_COMPOSER_WARNING_MESSAGE', () => {
    const action = {
      type: 'SET_COMPOSER_WARNING_MESSAGE',
      payload: 'WARNING!  TESTING IN PROGRESS!',
    };

    it('should update the warningMessage', () => {
      const initialMessage = state.warningMessage;
      const { warningMessage } = reducer(state, action);
      expect(warningMessage).not.toEqual(initialMessage);
      expect(warningMessage).toEqual(action.payload);
    });
  });

  describe('SET_NEW_REQUEST_FIELDS', () => {
    // alternates url and tests all 5 http/s methods and 3 gql types
    const getAction = {
      type: 'SET_NEW_REQUEST_FIELDS',
      payload: {
        method: 'GET',
        protocol: '',
        url: 'http://www.fakesite.com',
        graphQL: false,
      },
    };
    const postAction = {
      type: 'SET_NEW_REQUEST_FIELDS',
      payload: {
        method: 'POST',
        protocol: '',
        url: 'https://www.fakesite.com',
        graphQL: false,
      },
    };
    const putAction = {
      type: 'SET_NEW_REQUEST_FIELDS',
      payload: {
        method: 'PUT',
        protocol: '',
        url: 'http://www.fakesite.com',
        graphQL: false,
      },
    };
    const patchAction = {
      type: 'SET_NEW_REQUEST_FIELDS',
      payload: {
        method: 'PATCH',
        protocol: '',
        url: 'https://www.fakesite.com',
        graphQL: false,
      },
    };
    const deleteAction = {
      type: 'SET_NEW_REQUEST_FIELDS',
      payload: {
        method: 'DELETE',
        protocol: '',
        url: 'http://www.fakesite.com',
        graphQL: false,
      },
    };
    const queryAction = {
      type: 'SET_NEW_REQUEST_FIELDS',
      payload: {
        method: 'QUERY',
        protocol: '',
        url: 'https://www.fakesite.com',
        graphQL: true,
      },
    };
    const mutationAction = {
      type: 'SET_NEW_REQUEST_FIELDS',
      payload: {
        method: 'MUTATION',
        protocol: '',
        url: 'http://www.fakesite.com',
        graphQL: true,
      },
    };
    const subscriptionAction = {
      type: 'SET_NEW_REQUEST_FIELDS',
      payload: {
        method: 'SUBSCRIPTION',
        protocol: '',
        url: 'https://www.fakesite.com',
        graphQL: true,
      },
    };
    const requestStreamsAction = {
      type: 'SET_NEW_REQUEST_STREAMS',
      payload: {
        streamsArr: [],
        count: 0,
        streamContent: [],
        selectedPackage: 'helloworld',
        selectedRequest: 'helloRequest',
        selectedService: 'hello',
        selectedStreamingType: null,
        initialQuery: null,
        queryArr: null,
        protoPath: null,
        services: null,
      },
    };
    it('sets the newRequestStreams on SET_NEW_REQUEST_STREAMS', () => {
      const { newRequestStreams } = reducer(state, requestStreamsAction);
      expect(newRequestStreams).toEqual(requestStreamsAction.payload);
    });
    it('sets the newRequestFields on POST', () => {
      const { newRequestFields } = reducer(state, postAction);
      expect(newRequestFields).toEqual(postAction.payload);
    });
    it('sets the newRequestFields on GET', () => {
      const { newRequestFields } = reducer(state, getAction);
      expect(newRequestFields).toEqual(getAction.payload);
    });
    it('sets the newRequestFields on PUT', () => {
      const { newRequestFields } = reducer(state, putAction);
      expect(newRequestFields).toEqual(putAction.payload);
    });
    it('sets the newRequestFields on PATCH', () => {
      const { newRequestFields } = reducer(state, patchAction);
      expect(newRequestFields).toEqual(patchAction.payload);
    });
    it('sets the newRequestFields on DELETE', () => {
      const { newRequestFields } = reducer(state, deleteAction);
      expect(newRequestFields).toEqual(deleteAction.payload);
    });
    it('sets the newRequestFields on QUERY', () => {
      const { newRequestFields } = reducer(state, queryAction);
      expect(newRequestFields).toEqual(queryAction.payload);
    });
    it('sets the newRequestFields on MUTATION', () => {
      const { newRequestFields } = reducer(state, mutationAction);
      expect(newRequestFields).toEqual(mutationAction.payload);
    });
    it('sets the newRequestFields on SUBSCRIPTION', () => {
      const { newRequestFields } = reducer(state, subscriptionAction);
      expect(newRequestFields).toEqual(subscriptionAction.payload);
    });
  });

  describe('SET_NEW_REQUEST_HEADERS', () => {
    const contentTypeHeaderAction = {
      type: 'SET_NEW_REQUEST_HEADERS',
      payload: {
        headersArr: [
          {
            id: 0,
            active: true,
            key: 'content-type',
            value: 'application/json',
          },
        ],
        override: false,
        count: [
          { active: true, key: 'content-type', value: 'application/json' },
        ].length,
      },
    };
    const otherHeaderAction = {
      type: 'SET_NEW_REQUEST_HEADERS',
      payload: {
        headersArr: [
          {
            id: 0,
            active: true,
            key: 'content-type',
            value: 'application/json',
          },
          {
            id: 1,
            active: true,
            key: 'otherHeader',
            value: 'otherHeaderValue',
          },
        ],
        override: false,
        count: [
          {
            id: 0,
            active: true,
            key: 'content-type',
            value: 'application/json',
          },
          {
            id: 1,
            active: true,
            key: 'otherHeader',
            value: 'otherHeaderValue',
          },
        ].length,
      },
    };

    it('sets new requestHeaders', () => {
      const { newRequestHeaders } = reducer(state, contentTypeHeaderAction);
      expect(newRequestHeaders.headersArr.length).toBe(1);
      expect(newRequestHeaders.headersArr[0]).toEqual(
        contentTypeHeaderAction.payload.headersArr[0]
      );
      expect(newRequestHeaders.count).toBe(1);
      expect(newRequestHeaders.override).toBe(false);
    });
    it('can set multiple requestHeaders', () => {
      const { newRequestHeaders } = reducer(state, otherHeaderAction);
      expect(newRequestHeaders.headersArr.length).toBe(2);
      expect(newRequestHeaders.headersArr[1]).toEqual(
        otherHeaderAction.payload.headersArr[1]
      );
      expect(newRequestHeaders.count).toBe(2);
      expect(newRequestHeaders.override).toBe(false);
    });
  });

  describe('SET_NEW_REQUEST_BODY', () => {
    const action = {
      type: 'SET_NEW_REQUEST_BODY',
      payload: {
        bodyContent: '{ "key": "value"}',
        bodyVariables: '',
        bodyType: 'raw',
        rawType: 'application/json',
        JSONFormatted: true,
      },
    };

    it('sets new requestBody', () => {
      const { newRequestBody } = reducer(state, action);
      expect(newRequestBody).toEqual(action.payload);
      expect(typeof newRequestBody.bodyContent).toBe('string');
      expect(typeof newRequestBody.JSONFormatted).toBe('boolean');
    });
  });

  describe('SET_NEW_REQUEST_COOKIES', () => {
    const cookieAction = {
      type: 'SET_NEW_REQUEST_COOKIES',
      payload: {
        cookiesArr: [{ key: 'admin', value: 'password' }],
        count: [{ key: 'admin', value: 'password' }].length,
      },
    };
    const otherCookieAction = {
      type: 'SET_NEW_REQUEST_COOKIES',
      payload: {
        cookiesArr: [
          { key: 'admin', value: 'password' },
          { key: 'admin2', value: 'password2' },
        ],
        count: [
          { key: 'admin', value: 'password' },
          { key: 'admin2', value: 'password2' },
        ].length,
      },
    };

    it('sets new requestCookies', () => {
      const { newRequestCookies } = reducer(state, cookieAction);
      expect(newRequestCookies.cookiesArr.length).toBe(1);
      expect(newRequestCookies.cookiesArr[0]).toEqual(
        cookieAction.payload.cookiesArr[0]
      );
      expect(newRequestCookies.count).toBe(1);
    });
    it('can set multiple requestCookies', () => {
      const { newRequestCookies } = reducer(state, otherCookieAction);
      expect(newRequestCookies.cookiesArr.length).toBe(2);
      expect(newRequestCookies.cookiesArr[1]).toEqual(
        otherCookieAction.payload.cookiesArr[1]
      );
      expect(newRequestCookies.count).toBe(2);
    });
  });

  describe('SET_CURRENT_TAB', () => {
    const action = {
      type: 'SET_CURRENT_TAB',
      payload: 'Second Tab',
    };

    it('should update currentTab', () => {
      const { currentTab } = reducer(state, action);
      expect(currentTab).toEqual(action.payload);
    });
  });
});
