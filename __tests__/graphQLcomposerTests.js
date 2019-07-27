import reducer from '../src/client/reducers/business';
import { exportAllDeclaration, isTSAnyKeyword } from '@babel/types';

describe('GraphQL Composer', () => {
  let state;
  state = {
    currentTab: 'First Tab',
    reqResArray: [],
    history: [],
    warningMessage: "",
    newRequestFields: {
      method: 'GET',
      protocol: '',
      url: '',
      graphQL: false
    },
    newRequestHeaders: {
      headersArr: [],
      count: 0,
    },
    newRequestCookies: {
      cookiesArr: [],
      count: 0,
    },
    newRequestBody: {
      bodyContent: '',
      bodyType: 'none',
      rawType: 'Text (text/plain)',
      JSONFormatted: true,
      bodyVariables: ''
    },
  };

  

  describe('Setting GQL fields, headers, and body', () => {
    it('lskdf', () => {
      expect(5).toBe(5)
    })
  })
})