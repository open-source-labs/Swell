/**
 * @file Defines unit tests for slice located within the same file.
 *
 * @see https://redux.js.org/usage/writing-tests
 * The Redux docs recommend that you DON'T unit-test Redux-specific code, unless
 * it's complex. You should be performing integration tests. However, this
 * codebase is such a mess that we need some basic assurance about features
 * being added in before we try integrating them with the rest of the app.
 */
import reducer, {
  scheduledReqResCleared,
  scheduledReqResAdded,
} from './scheduledReqResSlice';
import { ReqRes, ReqResRequest, ReqResResponse } from '../../../types';

const dummyRequest: Readonly<ReqResRequest> = {
  body: 'Blah',
  bodyType: 'json',
  bodyVariables: '',
  cookies: [],
  graphQL: true,
  gRPC: false,
  headers: [],
  network: 'graphQL',
  protocol: 'http://',
  testContent: 'Blah blah',
  testResults: [],
  webRtc: false,
  ws: false,
};

const dummyResponse: ReqResResponse = {
  cookies: [],
  headers: {},
  events: [],
  tab: 'Tab 01',
  timeSent: 54830958430958340,
  timeReceived: 54830958430958940,
  url: 'http://zombo.com',
};

const dummyReqRes: Readonly<ReqRes> = {
  checked: false,
  closeCode: 0,
  connection: 'uninitialized',
  connectionType: '',
  createdAt: new Date('2019-02-15T21:40:44.132Z'),
  error: '',
  graphQL: true,
  gRPC: false,
  id: 0,
  isHTTP2: false,
  minimized: false,
  openapi: false,
  protocol: 'http://',
  request: dummyRequest,
  response: dummyResponse,
  rpc: 'flkdsjflk',
  service: 'flkdsjfklsdj',
  timeReceived: 564564,
  timeSent: 2,
  url: '',
  webRtc: false,
};

// Start of actual testing
describe('scheduledReqResSlice reducer', () => {
  let testingState!: ReqRes[];
  beforeEach(() => {
    testingState = [];
  });

  it('Should be able to return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual([]);
  });

  it('Should do nothing for unsupported action types', () => {
    const newState = reducer(testingState, { type: 'setFireToTheCodebase' });
    expect(newState).toEqual(testingState);
  });

  it('Should update state by performing immutable pushes', () => {
    const start = reducer(testingState, scheduledReqResAdded(dummyReqRes));
    expect(start).toEqual([dummyReqRes]);

    const updated = reducer(start, scheduledReqResAdded(dummyReqRes));
    expect(start).toEqual([dummyReqRes]);
    expect(updated).toEqual([dummyReqRes, dummyReqRes]);
  });

  it('Should clear out the state immutably', () => {
    const start = reducer(testingState, scheduledReqResAdded(dummyReqRes));
    expect(start).toEqual([dummyReqRes]);

    const updated = reducer(start, scheduledReqResCleared());
    expect(start).toEqual([dummyReqRes]);
    expect(updated).toEqual([]);
  });
});

