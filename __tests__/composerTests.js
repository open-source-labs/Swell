// import electron from 'electron'
// const session = require('electron').remote.session;
import reducer from '../src/client/reducers/business';
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson, { mountToJson } from 'enzyme-to-json';

import { JestEnvironment } from '@jest/environment';
// Enzyme is a wrapper around React test utilities which makes it easier to
// shallow render and traverse the shallow rendered tree.
// import * as actions from '../src/client/actions/actions.js';
// import httpController from '../src/client/controllers/httpController.js'
// import dbController from '../src/client/controllers/dbController.js'
// import reqResController from '../src/client/controllers/reqResController.js'
import ProtocolSelect from "../src/client/components/composer/NewRequest/ProtocolSelect.jsx";
// import FieldEntryForm from "../src/client/components/composer/NewRequest/FieldEntryForm.jsx";
// import HeaderEntryForm from '../src/client/components/composer/NewRequest/HeaderEntryForm.jsx';
// import CookieEntryForm from '../src/client/components/composer/NewRequest/CookieEntryForm.jsx';
// import BodyEntryForm from "../src/client/components/composer/NewRequest/BodyEntryForm.jsx";
// import GraphQLBodyEntryForm from "../src/client/components/composer/NewRequest/GraphQLBodyEntryForm.jsx";
// import GraphQLVariableEntryForm from "../src/client/components/composer/NewRequest/GraphQLVariableEntryForm.jsx";

// Newer Enzyme versions require an adapter to a particular version of React
configure({ adapter: new Adapter() });

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
    describe('ProtocolSelect', () => {
      let wrapper;
      const props = {
        currentProtocol: '',
        onChangeHandler: jest.fn(),
        graphQL: false
      };

      beforeAll(() => {
        wrapper = shallow(<ProtocolSelect {...props} />);
      });

      it('Renders a <div>', () => {
        expect(wrapper.type()).toEqual('div');
        // expect(wrapper.text()).toEqual('Mega: Markets');
        // expect(wrapper.find('strong').text()).toMatch('Mega');
      });

      it('lskdf', () => {
        expect(5).toBe(5)
      })
    })
  })
})