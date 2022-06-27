import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReqRes, $TSFixMe, $TSFixMeObject } from '../../../types';

/**
 * Keeps track of the current color to use with UI_SAFE_COLORS
 */
let currentColorIndex = 0;

/**
 * Defines a preset array of colors for graph points. If any color were allowed,
 * you would get weird cases where colors are almost the same as the background
 */
const UI_SAFE_COLORS = [
  '#C74CAE', // Magenta
  '#614EBF', // Purple/indigo
  '#28A5B0', // Teal
  '#DB613B', // Orange
  '#28B55E', // Green
  '#DED554', // Yellow
];

/**
 * Defines a whole HTTP request for generating graph data.
 *
 * Type definitions ripped from httpTest file.
 */
type HttpRequest = {
  id: number;

  /**
   * createdAt should be formatted like a Date object timestamp
   */
  createdAt: string;
  protocol: string;
  host: string;
  path: string;
  url: string;
  graphQL: boolean;
  gRPC: boolean;
  timeSent: string | null;
  timeReceived: string | null;
  connection: string;
  connectionType: $TSFixMe | null;
  checkSelected: boolean;
  protoPath: string | null;

  request: {
    method: string;
    headers: $TSFixMeObject[][];
    cookies: $TSFixMe[];
    body: string;
    bodyType: string;
    bodyVariables: string;
    rawType: string;
    isSSE: boolean;
    network: string;
    restUrl: string;
    wsUrl: string;
    gqlUrl: string;
    grpcUrl: string;
  };

  response: { headers: $TSFixMe | null; events: $TSFixMe | null };
  checked: boolean;
  minimized: boolean;
  tab: string;
};

type GraphPoint = {
  reqRes: HttpRequest;
  url: string;
  timeSent: string | null;
  timeReceived: string | null;
  createdAt: string;
  color: string;
};

/**
 * Defines a collection of various graph points for request objects, grouped by
 * the ID of each request object.
 *
 * Previously called DataPoints
 */
type GraphRecord = Record<ReqRes['id'], GraphPoint[]>;

const initialState: GraphRecord = {};

/**
 * Custom action creator needed because generating colors in a non-deterministic
 * way is a side effect and absolutely should not be in the Redux reducers.
 */
const graphUpdated = createAction(
  'graphPoints/updateGraph',
  (httpRequest: HttpRequest) => {
    // Previous code; keeping until we can tell where graph points are used
    // const MAX_CHANNEL_VALUE = 256;
    // const redChannel = Math.floor(Math.random() * MAX_CHANNEL_VALUE)
    // const greenChannel = Math.floor(Math.random() * MAX_CHANNEL_VALUE)
    // const blueChannel = Math.floor(Math.random() * MAX_CHANNEL_VALUE);
    // return { payload: {
    //   httpRequest,
    //   color: `${redChannel}, ${greenChannel}, ${blueChannel}`
    // }};

    const color = UI_SAFE_COLORS[currentColorIndex];
    currentColorIndex = (1 + currentColorIndex) % UI_SAFE_COLORS.length;
    return { payload: { httpRequest, color } };
  }
);

export const GraphPointsSlice = createSlice({
  name: 'graphPoints',
  initialState,
  reducers: {
    clearGraph: (state, action: PayloadAction<number>) => {
      state[action.payload] = [];
    },

    clearAllGraph: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(graphUpdated, (state, action) => {
      const { httpRequest, color } = action.payload;

      const { id } = httpRequest;
      if (!state[id]) {
        state[id] = [];
      }

      const pointsArray = state[id];
      const previouslySent = pointsArray.some(
        (request) => request.timeSent === httpRequest.timeSent
      );

      if (previouslySent) {
        return;
      }

      if (pointsArray.length > 49) {
        state[id] = pointsArray.slice(1);
      }

      pointsArray.push({
        reqRes: httpRequest,
        url: httpRequest.url,
        timeSent: httpRequest.timeSent,
        timeReceived: httpRequest.timeReceived,
        createdAt: httpRequest.createdAt,
        color: pointsArray?.[0]?.color ?? color,
      });
    });
  },
});

