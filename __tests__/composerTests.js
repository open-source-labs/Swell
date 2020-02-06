// import electron from 'electron'
// const session = require('electron').remote.session;
import reducer from '../src/client/reducers/business';
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson, { mountToJson } from 'enzyme-to-json';
import {remote} from "electron";
import { JestEnvironment } from '@jest/environment';
// Enzyme is a wrapper around React test utilities which makes it easier to
// shallow render and traverse the shallow rendered tree.
// import * as actions from '../src/client/actions/actions.js';
// import httpController from '../src/client/controllers/httpController.js'
// import historyController from '../src/client/controllers/historyController.js'
// import reqResController from '../src/client/controllers/reqResController.js'
// import ComposerNewRequest from "../src/client/components/composer/NewRequest/ComposerNewRequest.jsx"; //doesn't like png
import ProtocolSelect from "../src/client/components/composer/NewRequest/ProtocolSelect.jsx";
import FieldEntryForm from "../src/client/components/composer/NewRequest/FieldEntryForm.jsx";
// import HeaderEntryForm from '../src/client/components/composer/NewRequest/HeaderEntryForm.jsx'; //doesn't like png
import Header from '../src/client/components/composer/NewRequest/Header.jsx';
// import CookieEntryForm from '../src/client/components/composer/NewRequest/CookieEntryForm.jsx'; //doesn't like png
// import BodyEntryForm from "../src/client/components/composer/NewRequest/BodyEntryForm.jsx";
import BodyTypeSelect from "../src/client/components/composer/NewRequest/BodyTypeSelect.jsx";
import WWWForm from '../src/client/components/composer/NewRequest/WWWForm.jsx';
import WWWField from '../src/client/components/composer/NewRequest/WWWField.jsx';
import JSONTextArea from '../src/client/components/composer/NewRequest/JSONTextArea.jsx';
// import GraphQLBodyEntryForm from "../src/client/components/composer/NewRequest/GraphQLBodyEntryForm.jsx"; //doesn't like png
// import GraphQLVariableEntryForm from "../src/client/components/composer/NewRequest/GraphQLVariableEntryForm.jsx"; //doesn't like png
// import HistoryContainer from '../src/client/components/containers/HistoryContainer.jsx';  //doesn't like electron sessions
// import HistoryDate from '../src/client/components/display/HistoryDate.jsx'; //doesn't like electron sessions
// import History from '../src/client/components/display/History.jsx'; //doesn't like electron sessions or png
import Graph from '../src/client/components/display/Graph.jsx';
// import NavBarContainer from '../src/client/components/containers/NavBarContainer.jsx';  //doesn't like electron sessions
// import ReqResContainer from '../src/client/components/containers/ReqResContainer.jsx';  //doesn't like electron sessions
// import ReqRes from '../src/client/components/display/ReqRes.jsx'; //doesn't like electron sessions or png
// import OpenBtn from '../src/client/components/display/OpenBtn.jsx'; //doesn't like electron sessions or png
// import CloseBtn from '../src/client/components/display/CloseBtn.jsx'; //doesn't like electron sessions or png
import RequestTabs from '../src/client/components/display/RequestTabs.jsx';
import Tab from '../src/client/components/display/Tab.jsx';
// import WebSocketWindow from '../src/client/components/display/WebSocketWindow.jsx'; //doesn't like electron sessions
import WebSocketMessage from '../src/client/components/display/WebSocketMessage.jsx';
// import ResponseContainer from '../src/client/components/containers/ResponseContainer.jsx';  //doesn't like electron sessions
import ResponseTabs from '../src/client/components/display/ResponseTabs.jsx';
import ResponseEventsDisplay from '../src/client/components/display/ResponseEventsDisplay.jsx';
import SSERow from '../src/client/components/display/SSERow.jsx';
import ResponseHeadersDisplay from '../src/client/components/display/ResponseHeadersDisplay.jsx';
// import ResponseCookiesDisplay from '../src/client/components/display/ResponseCookiesDisplay.jsx'; //doesn't like electron sessions
import CookieTable from '../src/client/components/display/CookieTable.jsx';
import CookieTableRow from '../src/client/components/display/CookieTableRow.jsx';
import CookieTableCell from '../src/client/components/display/CookieTableCell.jsx';
// import ResponseSubscriptionDisplay from '../src/client/components/display/ResponseSubscriptionDisplay.jsx'; //doesn't like electron sessions


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
      });
    })
  })
})