import reducer from '../src/client/reducers/business';

describe ('Business reducer', () => {
  let state;

  beforeEach(() => {
    state = { 
      currentTab : 'First Tab',
      reqResArray : [],
      history : [],
      warningModalMessage : "",
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


})