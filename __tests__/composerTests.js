/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ProtocolSelect from '../src/client/components/composer/NewRequest/ProtocolSelect.jsx';

// Commented out this file since it is using Enzyme, which has been falling out of favor and currently does not work for this app version
// TODO: for the next tester, recommended to migrate to React Testing Library

// import { configure, shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

// configure({ adapter: new Adapter() });

// describe('GraphQL Composer', () => {
//   const state = {
//     currentTab: 'First Tab',
//     reqResArray: [],
//     history: [],
//     warningMessage: '',
//     newRequestFields: {
//       method: 'GET',
//       protocol: '',
//       url: '',
//       graphQL: false,
//     },
//     newRequestHeaders: {
//       headersArr: [],
//       count: 0,
//     },
//     newRequestCookies: {
//       cookiesArr: [],
//       count: 0,
//     },
//     newRequestBody: {
//       bodyContent: '',
//       bodyType: 'raw',
//       rawType: 'text/plain',
//       JSONFormatted: true,
//       bodyVariables: '',
//     },
//   };
//   describe('Setting GQL fields, headers, and body', () => {
//     describe('ProtocolSelect', () => {
//       let wrapper;
//       const props = {
//         currentProtocol: '',
//         onChangeHandler: jest.fn(),
//         graphQL: false,
//       };

//       beforeAll(() => {
//         wrapper = shallow(<ProtocolSelect {...props} />);
//       });

//       it('Renders a <div>', () => {
//         expect(wrapper.type()).toEqual('div');
//       });
//     });
//   });
// });
