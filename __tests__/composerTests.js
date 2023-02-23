/**
 * @file This entire file has been commented out, since all testing was done in
 * Enzyme, which is quickly losing relevance and is no longer the best tool for
 * testing frontend applications, especially React applications.
 *
 * @todo For the next tester, recommended that logic be migrated over to
 * React Testing Library.
 */

/* eslint-disable react/jsx-props-no-spreading */
// import React from 'react';
// import ProtocolSelect from '../src/client/components/composer/NewRequest/ProtocolSelect.jsx';

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
