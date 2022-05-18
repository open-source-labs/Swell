import reducer, { 
  getHistory,
  deleteFromHistory,
  clearHistory,
  getCollections,
  deleteFromCollection,
  resetComposerFields,
  collectionToReqRes,
  collectionAdd,
  collectionUpdate,
  reqResClear,
  reqResAdd,
  reqResDelete,
  setChecksAndMinis,
  reqResUpdate,
  scheduledReqResUpdate,
  scheduledReqResDelete,
  updateGraph,
  clearGraph,
  clearAllGraph,
  setComposerWarningMessage,
  setNewRequestFields,
  setNewRequestHeaders,
  setNewRequestStreams,
  setNewRequestBody,
  setNewRequestCookies,
  setNewTestContent,
  setNewRequestSSE,
  setIntrospectionData,
  saveCurrentResponseData,
  setNewRequestsOpenAPI
} from '../src/client/features/business/businessSlice.ts';


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
        webhook: false,
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
          body: {},
          urls: [],
        },
      },
      introspectionData: { schemaSDL: null, clientSchema: null },
      dataPoints: {},
      currentResponse: {
        request: {
          network: '',
        },
        response: {
          source: ''
        },
      },
    }
  });

  describe('default state', () => {
    it('should return a default state when given an undefined action', () => {
      expect(reducer(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe('unrecognized action types', () => {
    it('should return the original without any duplication', () => {
      const action = { type: 'aajsbicawlbejckr' };
      expect(reducer(state, action)).toBe(state);
    });
  });

  describe('Get History', () => {
    const fakeHistory = [
      {
        date: '02/15/2019',
        history: [
          {
            id: 'd79d8f1a-f53c-41a1-a7e3-514f9f5cf24e',
            createdAt: '2019-02-15T21:40:44.132Z',
          },
          {
            id: 'c8d73eec-e383-4735-943a-20deab42ecff',
            createdAt: '2019-02-15T20:52:35.990Z',
          },
        ],
      },
      {
        date: '02/14/2019',
        history: [
          {
            id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
            createdAt: '2019-02-15T00:40:56.360Z',
          },
          {
            id: '577eab93-e707-4dc0-af45-7adcc78807fa',
            createdAt: '2019-02-15T00:16:56.133Z',
          },
        ],
      },
    ];

    const action = {
      payload: fakeHistory,
    };

    it('should replace history in state', () => {
      const { reqResArray, history } = reducer(state, getHistory(fakeHistory));
      expect(reqResArray).toEqual([]);
      expect(history).toEqual(fakeHistory);
    });
  });

  describe('Delete from history', () => {
    const fakeHistory = [
      {
        date: '02/15/2019',
        history: [
          {
            id: 'c8d73eec-e383-4735-943a-20deab42ecff',
            createdAt: '2019-02-15T20:52:35.990Z',
          },
        ],
      },
      {
        date: '02/14/2019',
        history: [
          {
            id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
            createdAt: new Date('2019-02-15T00:40:56.360Z'),
          },
          {
            id: '577eab93-e707-4dc0-af45-7adcc78807fa',
            createdAt: new Date('2019-02-15T00:16:56.133Z'),
          },
        ],
      },
    ];

    beforeEach(() => {
      state.history = fakeHistory;
    });

    it('should delete the proper history', () => {
      const action = {
        payload: {
          id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
          createdAt: new Date('2019-02-15T00:40:56.360Z'),
        },
      };
      console.log(action.payload.createdAt)
      const { history } = reducer(state, deleteFromHistory(action.payload));
      expect(history).not.toBe(fakeHistory);
      expect(history[1].history.length).toEqual(1);
      expect(history[1].history[0].id).toBe(
        '577eab93-e707-4dc0-af45-7adcc78807fa'
      );
    });

    it('should remove date array if empty', () => {
      const action = {
        payload: {
          id: 'c8d73eec-e383-4735-943a-20deab42ecff',
          createdAt: '2019-02-15T20:52:35.990Z',
        },
      };
      const initialHistory = state.history;
      const { history } = reducer(state, deleteFromHistory(action.payload));
      expect(history).not.toBe(initialHistory);
      expect(initialHistory.length).toBe(2);
      expect(history.length).toBe(1);
    });
  });

  describe('Clear history', () => {
    const fakeHistory = [
      {
        date: '02/15/2019',
        history: [
          {
            id: 'c8d73eec-e383-4735-943a-20deab42ecff',
            createdAt: '2019-02-15T20:52:35.990Z',
          },
        ],
      },
      {
        date: '02/14/2019',
        history: [
          {
            id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
            createdAt: new Date('2019-02-15T00:40:56.360Z'),
          },
          {
            id: '577eab93-e707-4dc0-af45-7adcc78807fa',
            createdAt: new Date('2019-02-15T00:16:56.133Z'),
          },
        ],
      },
    ];

    beforeEach(() => {
      state.history = fakeHistory;
    });

    it('should clear history', ()=>{
      const action = {type: 'CLEAR_HISTORY'}
      const { history } = reducer(state, clearHistory())
      console.log(history)
      expect(history).toEqual([])
    });

  });

  describe('Get collections', () => {
    const fakeCollections = [
      {
        id: 'collection1',
        collection1: `test`
      },
      {
        id: 'collection2',
        collection2: 'another test'
      },
      {
        id: 'collection3',
        collection3: 'a third test'
      },
      {
        id: 'collection4',
        collection4: 'the last test'
      },
    ];

    const action = {
      payload: fakeCollections,
    };

    it('should replace collections in state', () => {
      const { reqResArray, collections } = reducer(state, getCollections(fakeCollections));
      expect(reqResArray).toEqual([]);
      expect(collections).toEqual(fakeCollections);
    });
  });

  describe('Delete from collection', () => {
    const fakeCollections = [
      {
        id: 'collection1',
        collection1: `test`
      },
      {
        id: 'collection2',
        collection2: 'another test'
      },
      {
        id: 'collection3',
        collection3: 'a third test'
      },
      {
        id: 'collection4',
        collection4: 'the last test'
      },
    ];
    beforeEach(() => {
      state.collections = fakeCollections;
    });

    const action = {
      payload: {id: 'collection3'},
    };

    it('should delete a specific collection', () => {
      const {collections} = reducer(state, deleteFromCollection(action.payload));
      expect(collections.length).toEqual(3);
      expect(collections[2]).toEqual(fakeCollections[3])
    });
  });

  describe('Reset composer fields', () => {
    const fakeRequestHeaders = {
      headersArr: [`fake`,`request`,`headers`],
      count: 3
    }
    const fakeRequestCookies = {
      headersArr: [`fake`,`request`,`cookies`],
      count: 3
    }
    const fakeRequestBody = {
      bodyIsNew: false,
      bodyContent: 'BIG HOWDY',
      bodyVariables: 'ANOTHER BIG HOWDY',
      bodyType: 'fit but still eats bread',
      rawType: 'text/jokes',
      JSONFormatted: false,
    }
    const fakeRequestFields = {
      protocol: 'ghost',
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
      webhook: false,
      network: 'rest',
      testContent: '',
      testResults: [],
      openapiReqObj: {},
    }
    const fakeRequestSSE = {
      isSSE: true
    }
    const fakeWarningMessage = {
      err: `you can't do this to me`
    }


    beforeEach(() => {
      state.newRequestHeaders = fakeRequestHeaders;
      state.newRequestCookies = fakeRequestCookies;
      state.newRequestBody = fakeRequestBody;
      state.newRequestFields = fakeRequestFields;
      state.newRequestSSE = fakeRequestSSE;
      state.warningMessage = fakeWarningMessage;
    });

    const action = {
      payload: 'it shouldnt matter',
    };

    it('Reset composer fields', () => {
      const {newRequestHeaders, newRequestCookies, newRequestBody, newRequestFields, newRequestSSE, warningMessage} = reducer(state, resetComposerFields(action.payload));
      expect(newRequestHeaders).toEqual({
        headersArr: [],
        count: 0,
      });
      expect(newRequestCookies).toEqual({
        cookiesArr: [],
        count: 0,
      });
      expect(newRequestBody).toEqual({
        bodyContent: '',
        bodyVariables: '',
        bodyType: 'raw',
        rawType: 'text/plain',
        JSONFormatted: true,
        bodyIsNew: false,
      });
      expect(newRequestFields).toEqual({
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
        webhook: false,
        network: 'rest',
        testContent: '',
        testResults: [],
        openapiReqObj: {},
      });
      expect(newRequestSSE).toEqual({
        isSSE: false,
      });
      expect(warningMessage).toEqual({});
    });
  });

  describe('Collection to reqres', () => {
    const action = {
      payload: {
        collection1: [`hi`],
        collection2: [`bye`],
        collection3: [`howdy`],
      }
    };

    it('should convert collections to request/responses', () => {
      const {reqResArray} = reducer(state,collectionToReqRes(action.payload));
      expect(reqResArray).toEqual(action.payload);
    });
    
    it('should copy collection, not point request/responses to collections', () => {
      const {reqResArray} = reducer(state,collectionToReqRes(action.payload));
      expect(reqResArray).not.toBe(action.payload);
    });
  });

  describe('Collection add', () => {
    const action = {
      payload: {newCollection: [`hi`]}
    };

    it('should add a collection to collections', () => {
      const {collections} = reducer(state,collectionAdd(action.payload));
      expect(collections).toEqual([action.payload]);
    });
    
  });

  describe('Collection update', () => {
    const fakeCollections = [
      {
        name: 'collection1',
        collection1: `test`
      },
      {
        name: 'collection2',
        collection2: 'another test'
      },
      {
        name: 'collection3',
        collection3: 'a third test'
      },
      {
        name: 'collection4',
        collection4: 'the last test'
      },
    ];

    const action = {
      payload: {
        name: 'collection3',
        collection3: 'this should be updated'
      }
    };
    beforeEach(() => {
      state.collections = fakeCollections;
    });

    it('should update a collection by name', () => {
      const {collections} = reducer(state,collectionUpdate(action.payload));
      expect(collections[2]).toEqual(action.payload);
    });
    
  });

  describe('Reqres clear', () => {
    const action = {
    };

    it('should empty the reqResArray', () => {
      const initialReqResArray = [{ first: 1 }, { second: 2 }];
      // state.reqResArray = initialReqResArray;
      // expect(state.reqResArray).toBe(initialReqResArray); //unnecessary...?
      const { reqResArray } = reducer(state, reqResClear(action));
      expect(reqResArray).not.toBe(initialReqResArray);
      expect(reqResArray).toEqual([]);
    });
  });

  describe('Reqres add', () => {
    const fakeReqRes1 = {
      id: 'd79d8f1a-f53c-41a1-a7e3-514f9f5cf24e',
      createdAt: '2019-02-15T21:40:44.132Z',
      protocol: 'http://',
      request: { method: 'POST', body: 'I am a request body' },
      response: {},
    };

    const fakeReqRes2 = {
      id: 'c8d73eec-e383-4735-943a-20deab42ecff',
      createdAt: '2019-02-16T20:52:35.990Z',
      protocol: 'http://',
      request: { method: 'POST', body: 'I am a newer request body' },
      response: {},
    };

    const fakeReqRes3 = {
      id: 'c8d73eec-e383-4744-943a-20deab42ecff',
      createdAt: '2019-02-16T20:53:35.990Z',
      protocol: 'http://',
      request: { method: 'POST', body: 'I am the newest request body' },
      response: {},
    };

    const action1 = {
      payload: fakeReqRes1,
    };

    const action2 = {
      payload: fakeReqRes2,
    };

    it('should add the reqRes to reqResArray', () => {
      const initialReqResArray = state.reqResArray;
      const { reqResArray } = reducer(state, reqResAdd(action1.payload));
      expect(reqResArray).not.toEqual(initialReqResArray);
      expect(reqResArray.length).toEqual(1);
      expect(reqResArray[0]).toEqual(fakeReqRes1);
      expect(reqResArray[0].request.body).toEqual('I am a request body');
    });

    it('should add the reqRes to the history', () => {
      const firstState = reducer(state, reqResAdd(action1.payload));
      expect(firstState.history.length).toEqual(1);
      const { history } = reducer(firstState, reqResAdd(action2.payload));
      expect(history.length).toEqual(2);
      expect(history[0].date).toEqual('02/16/2019');
      expect(history[1].date).toEqual('02/15/2019');
    });

    it('should be added to the same day if request was sent on same day', () => {
      const firstState = reducer(state, reqResAdd(action1.payload));
      const secondState = reducer(firstState, reqResAdd(action2.payload));
      const { history } = reducer(firstState, reqResAdd(action3.payload));
      expect(history.length).toEqual(2);
      expect(history[0].date.history.length).toEqual(2);
    });
  });

  describe('Reqres delete', () => {
    const fakeReqResArray = [
      {
        id: 'c8d73eec-e383-4735-943a-20deab42ecff',
        createdAt: '2019-02-15T20:52:35.990Z',
      },
      {
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        createdAt: '2019-02-15T00:40:56.360Z',
      },
      {
        id: '577eab93-e707-4dc0-af45-7adcc78807fa',
        createdAt: '2019-02-15T00:16:56.133Z',
      },
    ];

    const action = {
      payload: fakeReqResArray[1],
    };

    it('should delete a reqRes from reqResArray', () => {
      const initialReqResArray = state.reqResArray;
      state.reqResArray = fakeReqResArray;
      const { reqResArray } = reducer(state, reqResDelete(action.payload));
      expect(reqResArray).not.toBe(initialReqResArray);
      expect(reqResArray.length).toEqual(2);
      expect(reqResArray[0]).toEqual(fakeReqResArray[0]);
      expect(reqResArray[1]).toEqual(fakeReqResArray[2]);
    });
  });

  describe('Set checks and minis',()=>{
    const fakeReqResArray = [
      {
        id: 'c8d73eec-e383-4735-943a-20deab42ecff',
        createdAt: '2019-02-15T20:52:35.990Z',
      },
      {
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        createdAt: '2019-02-15T00:40:56.360Z',
      },
      {
        id: '577eab93-e707-4dc0-af45-7adcc78807fa',
        createdAt: '2019-02-15T00:16:56.133Z',
      },
    ];
    const action = {
      payload: fakeReqResArray
    }
    it('Should replace reqResArray with new',()=>{
      state.reqResArray = ['nothing'];
      const {reqResArray} = reducer(state, setChecksAndMinis(action.payload));
      expect(reqResArray).toEqual(fakeReqResArray)
    })
  })

  describe('Reqres update', () => {
    const fakeReqResArray = [
      {
        id: 'c8d73eec-e383-4735-943a-20deab42ecff',
        createdAt: '2019-02-15T20:52:35.990Z',
      },
      {
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        createdAt: '2019-02-15T00:40:56.360Z',
      },
      {
        id: '577eab93-e707-4dc0-af45-7adcc78807fa',
        createdAt: '2019-02-15T00:16:56.133Z',
      },
    ];

    const action = {
      payload: {
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        createdAt: '2018-02-15T00:40:56.360Z',
        newKey: 'this is a new value',
      },
    };

    it('should update a reqRes from reqResArray', () => {
      const initialReqResArray = state.reqResArray;
      state.reqResArray = fakeReqResArray;
      const { reqResArray } = reducer(state, reqResUpdate(action.payload));
      expect(reqResArray).not.toBe(initialReqResArray);
      expect(reqResArray.length).toEqual(3);
      expect(reqResArray[1]).toEqual(action.payload);
      expect(reqResArray[0]).toEqual(fakeReqResArray[0]);
      expect(reqResArray[2]).toEqual(fakeReqResArray[2]);
    });
  });

  describe('Scheduled req res update',()=>{
    const fakeReqResArray1 = [
      {
        id: 'c8d73eec-e383-4735-943a-20deab42ecff',
        createdAt: '2019-02-15T20:52:35.990Z',
      },
      {
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        createdAt: '2019-02-15T00:40:56.360Z',
      }]
    const fakeReqRes=
      {
        id: '577eab93-e707-4dc0-af45-7adcc78807fa',
        createdAt: '2019-02-15T00:16:56.133Z',
      };
    const action = {
      payload: fakeReqRes
    }
    it('Should add reqres to end of schedule array',()=>{
      state.scheduledReqResArray = fakeReqResArray1;
      const {scheduledReqResArray} = reducer(state, scheduledReqResUpdate(action.payload));
      expect(scheduledReqResArray[scheduledReqResArray.length-1]).toEqual(fakeReqRes)
    })
  })

  describe('Scheduled req res delete',()=>{
    const fakeReqResArray = [
      {
        id: 'c8d73eec-e383-4735-943a-20deab42ecff',
        createdAt: '2019-02-15T20:52:35.990Z',
      },
      {
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        createdAt: '2019-02-15T00:40:56.360Z',
      },
      {
        id: '577eab93-e707-4dc0-af45-7adcc78807fa',
        createdAt: '2019-02-15T00:16:56.133Z',
      },
    ];
    const action = {payload: 'doesnt matter'}
    it('Should delete everything from scheduled reqres',()=>{
      state.scheduledReqResArray = fakeReqResArray;
      const {scheduledReqResArray} = reducer(state, scheduledReqResDelete(action.payload));
      expect(scheduledReqResArray).toEqual([])
    })
  })

  describe('Update graph',()=>{
    const newData ={
      id: '577eab93-e707-4dc0-af45-7adcc78807fa',
      url: 'google.com',
      timeSent: '11:30',
      timeRecieved: '15:30',
      createdAt: '2019-02-15T00:16:56.133Z'
    }
    it('Should add a data point to the graph', ()=>{
      const {dataPoints} = reducer(state, updateGraph(newData));
      expect(dataPoints[newData.id].length).toEqual(1);
    })
  })

  describe('Set composer warning message', () => {
    const action = {
      payload: 'WARNING!  TESTING IN PROGRESS!',
    };

    it('should update the warningMessage', () => {
      const initialMessage = state.warningMessage;
      const { warningMessage } = reducer(state, setComposerWarningMessage(action.payload));
      expect(warningMessage).not.toEqual(initialMessage);
      expect(warningMessage).toEqual(action.payload);
    });
  });

  describe('Set new request', () => {
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
    it('sets the newRequestStreams', () => {
      const { newRequestStreams } = reducer(state, setNewRequestStreams(requestStreamsAction.payload));
      expect(newRequestStreams).toEqual(requestStreamsAction.payload);
    });
    it('sets the newRequestFields on POST', () => {
      const { newRequestFields } = reducer(state, setNewRequestFields(postAction.payload));
      expect(newRequestFields).toEqual(postAction.payload);
    });
    it('sets the newRequestFields on GET', () => {
      const { newRequestFields } = reducer(state, setNewRequestFields(getAction.payload));
      expect(newRequestFields).toEqual(getAction.payload);
    });
    it('sets the newRequestFields on PUT', () => {
      const { newRequestFields } = reducer(state, setNewRequestFields(putAction.payload));
      expect(newRequestFields).toEqual(putAction.payload);
    });
    it('sets the newRequestFields on PATCH', () => {
      const { newRequestFields } = reducer(state, setNewRequestFields(patchAction.payload));
      expect(newRequestFields).toEqual(patchAction.payload);
    });
    it('sets the newRequestFields on DELETE', () => {
      const { newRequestFields } = reducer(state, setNewRequestFields(deleteAction.payload));
      expect(newRequestFields).toEqual(deleteAction.payload);
    });
    it('sets the newRequestFields on QUERY', () => {
      const { newRequestFields } = reducer(state, setNewRequestFields(queryAction.payload));
      expect(newRequestFields).toEqual(queryAction.payload);
    });
    it('sets the newRequestFields on MUTATION', () => {
      const { newRequestFields } = reducer(state, setNewRequestFields(mutationAction));
      expect(newRequestFields).toEqual(mutationAction.payload);
    });
    it('sets the newRequestFields on SUBSCRIPTION', () => {
      const { newRequestFields } = reducer(state, setNewRequestFields(subscriptionAction.payload));
      expect(newRequestFields).toEqual(subscriptionAction.payload);
    });
  });

  describe('Set new request headers', () => {
    const contentTypeHeaderAction = {
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
      const { newRequestHeaders } = reducer(state, setNewRequestHeaders(contentTypeHeaderAction.payload));
      expect(newRequestHeaders.headersArr.length).toBe(1);
      expect(newRequestHeaders.headersArr[0]).toEqual(
        contentTypeHeaderAction.payload.headersArr[0]
      );
      expect(newRequestHeaders.count).toBe(1);
      expect(newRequestHeaders.override).toBe(false);
    });
    it('can set multiple requestHeaders', () => {
      const { newRequestHeaders } = reducer(state, setNewRequestHeaders(otherHeaderAction.payload));
      expect(newRequestHeaders.headersArr.length).toBe(2);
      expect(newRequestHeaders.headersArr[1]).toEqual(
        otherHeaderAction.payload.headersArr[1]
      );
      expect(newRequestHeaders.count).toBe(2);
      expect(newRequestHeaders.override).toBe(false);
    });
  });

  describe('Set new request body', () => {
    const action = {
      payload: {
        bodyContent: '{ "key": "value"}',
        bodyVariables: '',
        bodyType: 'raw',
        rawType: 'application/json',
        JSONFormatted: true,
      },
    };

    it('sets new requestBody', () => {
      const { newRequestBody } = reducer(state, setNewRequestBody(action.payload));
      expect(newRequestBody).toEqual(action.payload);
      expect(typeof newRequestBody.bodyContent).toBe('string');
      expect(typeof newRequestBody.JSONFormatted).toBe('boolean');
    });
  });

  describe('Set new request cookies', () => {
    const cookieAction = {
      payload: {
        cookiesArr: [{ key: 'admin', value: 'password' }],
        count: [{ key: 'admin', value: 'password' }].length,
      },
    };
    const otherCookieAction = {
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
      const { newRequestCookies } = reducer(state, setNewRequestCookies(cookieAction.payload));
      expect(newRequestCookies.cookiesArr.length).toBe(1);
      expect(newRequestCookies.cookiesArr[0]).toEqual(
        cookieAction.payload.cookiesArr[0]
      );
      expect(newRequestCookies.count).toBe(1);
    });
    it('can set multiple requestCookies', () => {
      const { newRequestCookies } = reducer(state, setNewRequestCookies(otherCookieAction.payload));
      expect(newRequestCookies.cookiesArr.length).toBe(2);
      expect(newRequestCookies.cookiesArr[1]).toEqual(
        otherCookieAction.payload.cookiesArr[1]
      );
      expect(newRequestCookies.count).toBe(2);
    });
  });

  describe('Set new test content', () => {
    const action = {
      payload: ' this is a new test!',
    };

    it('sets new test content', () => {
      const { newRequestFields } = reducer(state, setNewTestContent(action.payload));
      expect(newRequestFields.testContent).toEqual(action.payload);
    });
  });

  describe('Set new request SSE', () => {
    const action = {
      payload: true,
    };

    it('sets new test content', () => {
      const { newRequestSSE } = reducer(state, setNewRequestSSE(action.payload));
      expect(newRequestSSE).toEqual({'isSSE': true});
    });
  });

  describe('Set introspection data', () => {
    const action = {
      payload: 'this is introspection data!',
    };

    it('sets new introspection data', () => {
      const { introspectionData } = reducer(state, setIntrospectionData(action.payload));
      expect(introspectionData).toEqual(action.payload);
    });
  });

  describe('Save current response data', () => {
    const action = {
      payload: 'this is the current response data!',
    };

    it('saves current response data', () => {
      const { currentResponse } = reducer(state, saveCurrentResponseData(action.payload));
      expect(currentResponse).toEqual(action.payload);
    });
  });

  describe('Set new requests open API', () => {
    const action = {
      payload: 'this is the new openAPI request!',
    };

    it('sets the new requests for openAPI', () => {
      const { newRequestsOpenAPI } = reducer(state, setNewRequestsOpenAPI(action.payload));
      expect(newRequestsOpenAPI).toEqual(action.payload);
    });
  });

});
