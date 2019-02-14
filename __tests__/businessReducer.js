import subject from '../src/client/reducers/business';

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
      expect(subject(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe('unrecognized action types', () => {
    it('should return the original without any duplication', () => {
      const action = { type: 'aajsbicawlbejckr' };
      expect(subject(state, action)).toBe(state);
    });
  });


})