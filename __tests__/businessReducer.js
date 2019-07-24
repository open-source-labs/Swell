import reducer from '../src/client/reducers/business';

describe ('Business reducer', () => {
  let state;

  beforeEach(() => {
    state = { 
      currentTab : 'First Tab',
      reqResArray : [],
      history : [],
      warningMessage : "",
      newRequestFields : {
        method : 'GET',
        protocol : 'http://',
        url : 'http://',
      },
      newRequestHeaders : {
        headersArr : [],
        count : 0,
      },
      newRequestCookies : {
        cookiesArr : [],
        count : 0,
      },
      newRequestBody : {
        bodyContent : '',
        bodyType : 'none',
        rawType : 'Text (text/plain)',
        JSONFormatted : true,
      },
    };
  })

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
        date: "02/15/2019", 
        history: [
          { id: 'd79d8f1a-f53c-41a1-a7e3-514f9f5cf24e', created_at: '2019-02-15T21:40:44.132Z' },
          { id: 'c8d73eec-e383-4735-943a-20deab42ecff', created_at: '2019-02-15T20:52:35.990Z' }
        ]
      },
      { 
        date: "02/14/2019", 
        history: [
          { id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd', created_at: '2019-02-15T00:40:56.360Z' },
          { id: '577eab93-e707-4dc0-af45-7adcc78807fa', created_at: '2019-02-15T00:16:56.133Z' }
        ]
      }
    ];
    
    const action = {
      type: 'GET_HISTORY',
      payload: fakeHistory
    }

    it('should update history in state', () => {
      const { reqResArray, history } = reducer(state, action)
      expect(reqResArray).toEqual([]);
      expect(history).toEqual(fakeHistory);
    })
  })

  describe('DELETE_HISTORY', () => {
    const fakeHistory = [
        { 
          date: "02/15/2019", 
          history: [
            { id: 'c8d73eec-e383-4735-943a-20deab42ecff', created_at: '2019-02-15T20:52:35.990Z' }
          ]
        },
        { 
          date: "02/14/2019", 
          history: [
            { id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd', created_at: '2019-02-15T00:40:56.360Z' },
            { id: '577eab93-e707-4dc0-af45-7adcc78807fa', created_at: '2019-02-15T00:16:56.133Z' }
          ]
        }
      ];

    beforeEach(() => {
      state.history = fakeHistory;
    })
  

    it('should delete the proper history', () => {

      const action = {
        type: 'DELETE_HISTORY',
        payload: { id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd', created_at: '2019-02-15T00:40:56.360Z' }
      }

      const { history } = reducer(state, action);
      expect(history).not.toBe(fakeHistory);
      expect(history[1].history.length).toEqual(1);
      expect(history[1].history[0].id).toBe('577eab93-e707-4dc0-af45-7adcc78807fa');
    })

    it('should remove date array if empty', () => {

      const action = {
        type: 'DELETE_HISTORY',
        payload: { id: 'c8d73eec-e383-4735-943a-20deab42ecff', created_at: '2019-02-15T20:52:35.990Z' }
      }
      const initialHistory = state.history;
      const { history } = reducer(state, action);
      expect(history).not.toBe(initialHistory);
      expect(initialHistory.length).toBe(2);
      expect(history.length).toBe(1);
    })
  })

  describe('REQRES_CLEAR', () => {
    const action = {
      type: 'REQRES_CLEAR'
    }

    it('should empth the reqResArray', () => {
      const initialReqResArray = [ { first: 1} , { second: 2 } ]
      state.reqResArray = initialReqResArray;
      expect(state.reqResArray).toBe(initialReqResArray);
      const { reqResArray } = reducer(state, action);
      expect(reqResArray).not.toBe(initialReqResArray);
      expect(reqResArray).toEqual([]);
    })
  })

  describe('REQRES_ADD', () => {
    const fakeReqRes1 = { 
      id: 'd79d8f1a-f53c-41a1-a7e3-514f9f5cf24e',
      created_at: '2019-02-15T21:40:44.132Z',
      protocol: 'http://',
      request: {method: 'POST', body: 'I am a request body'},
      response: {}
    }

    const fakeReqRes2 = { 
      id: 'c8d73eec-e383-4735-943a-20deab42ecff',
      created_at: '2019-02-16T20:52:35.990Z',
      protocol: 'http://',
      request: {method: 'POST', body: 'I am a newer request body'},
      response: {}
    }

    const action1 = {
      type: 'REQRES_ADD',
      payload: fakeReqRes1
    }

    const action2 = {
      type: 'REQRES_ADD',
      payload: fakeReqRes2
    }

    it('should add the reqRes to reqResArray', () => {
      const initialReqResArray = state.reqResArray;
      const { reqResArray } = reducer(state, action1);
      expect(reqResArray).not.toEqual(initialReqResArray);
      expect(reqResArray.length).toEqual(1);
      expect(reqResArray[0]).toEqual(fakeReqRes1);
      expect(reqResArray[0].request.body).toEqual('I am a request body')
    })

    it('should add the reqRes to the history', () => {
      const firstState = reducer(state, action1);
      expect(firstState.history.length).toEqual(1);
      const { history } = reducer(firstState, action2);
      expect(history.length).toEqual(2);
      expect(history[0].date).toEqual('02/16/2019');
      expect(history[1].date).toEqual('02/15/2019');
    })

  })

  describe('REQRES_DELETE', () => {
    const fakeReqResArray = [
      { id: 'c8d73eec-e383-4735-943a-20deab42ecff', created_at: '2019-02-15T20:52:35.990Z' },
      { id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd', created_at: '2019-02-15T00:40:56.360Z' },
      { id: '577eab93-e707-4dc0-af45-7adcc78807fa', created_at: '2019-02-15T00:16:56.133Z' }
    ];

    const action = {
      type: 'REQRES_DELETE',
      payload: fakeReqResArray[1]
    }


    it('should delete a reqRes from reqResArray', () => {
      const initialReqResArray = state.reqResArray;
      state.reqResArray = fakeReqResArray;
      const { reqResArray } = reducer(state, action);
      expect(reqResArray).not.toBe(initialReqResArray);
      expect(reqResArray.length).toEqual(2);
      expect(reqResArray[1]).toEqual(fakeReqResArray[2]);
    })
  })

  describe('REQRES_UPDATE', () => {
    const fakeReqResArray = [
      { id: 'c8d73eec-e383-4735-943a-20deab42ecff', created_at: '2019-02-15T20:52:35.990Z' },
      { id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd', created_at: '2019-02-15T00:40:56.360Z' },
      { id: '577eab93-e707-4dc0-af45-7adcc78807fa', created_at: '2019-02-15T00:16:56.133Z' }
    ];

    const action = {
      type: 'REQRES_UPDATE',
      payload: { 
        id: '0faf2207-20d3-4f62-98ca-51a39c8c15dd',
        created_at: '2019-02-15T00:40:56.360Z',
        newKey: 'this is a new value'
      }
    }

    it('should update a reqRes from reqResArray', () => {
      const initialReqResArray = state.reqResArray;
      state.reqResArray = fakeReqResArray;
      const { reqResArray } = reducer(state, action);
      expect(reqResArray).not.toBe(initialReqResArray);
      expect(reqResArray.length).toEqual(3);
      expect(reqResArray[1]).toEqual(action.payload)
      expect(reqResArray[0]).toEqual(fakeReqResArray[0]);
      expect(reqResArray[2]).toEqual(fakeReqResArray[2]);
    })
  })

  describe('SET_COMPOSER_WARNING_MESSAGE', () => {
    const action = {
      type: 'SET_COMPOSER_WARNING_MESSAGE',
      payload: 'WARNING!  TESTING IN PROGRESS!'
    }

    it('should update the warningMessage', () => {
      const initialMessage = state.warningMessage;
      const { warningMessage } = reducer(state, action);
      expect(warningMessage).not.toEqual(initialMessage);
      expect(warningMessage).toEqual(action.payload);
    })
  })

  describe('SET_NEW_REQUEST_FIELDS', () => {
    const action = {
      type: 'SET_NEW_REQUEST_FIELDS',
      payload: {
        method : 'POST',
        protocol : 'https://',
        url : 'https://www.fakesite.com',
      }
    }
    it('sets the newRequestFields', () => {
      const { newRequestFields } = reducer(state, action);
      expect(newRequestFields).toEqual(action.payload);
    })
  })

  describe('SET_NEW_REQUEST_HEADERS', () => {
    const action = {
      type: 'SET_NEW_REQUEST_HEADERS',
      payload: {
        active: true,
        key: 'content-type',
        value: 'application/json'
      }
    }

    it('sets new requestHeaders', () => {
      const { newRequestHeaders } = reducer(state, action);
      expect(newRequestHeaders).toEqual(action.payload);
    })
  })

  describe('SET_NEW_REQUEST_BODY', () => {
    const action = {
      type: 'SET_NEW_REQUEST_BODY',
      payload: {
        bodyContent: '{ "key": "value"}',
        bodyType: 'raw',
        rawType: 'application/json',
        JSONFormatted: true
      }
    }

    it('sets new requestBody', () => {
      const { newRequestBody } = reducer(state, action);
      expect(newRequestBody).toEqual(action.payload);
      expect(typeof newRequestBody.bodyContent).toBe('string');
      expect(typeof newRequestBody.JSONFormatted).toBe('boolean');
    })
  })

  describe('SET_NEW_REQUEST_COOKIES', () => {
    const action = {
      type: 'SET_NEW_REQUEST_COOKIES',
      payload: {
        key: 'admin',
        value: 'password'
      }
    }

    it('sets new requestCookies', () => {
      const { newRequestCookies } = reducer(state, action);
      expect(newRequestCookies).toEqual(action.payload);
    })
  })

  describe('SET_CURRENT_TAB', () => {
    const action = {
      type: 'SET_CURRENT_TAB',
      payload: 'Second Tab'
    }

    it('should update currentTab', () => {
      const { currentTab } = reducer(state, action);
      expect(currentTab).toEqual(action.payload);
    })
  })
  
})