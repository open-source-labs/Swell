import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type ReqRes } from '~/types';

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
 * Defines a object for representing a graph point.
 *
 * @todo Update code so that all Date objects are removed; Dates are not valid
 * JSON-serializable values.
 */
type GraphPoint = {
  reqRes: ReqRes;
  url: string;
  timeSent: number | null;

  timeReceived: number | Date;
  createdAt: Date | string;
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
export const graphUpdated = createAction(
  'graphPoints/graphUpdated',
  (reqRes: ReqRes) => {
    const color = UI_SAFE_COLORS[currentColorIndex];
    currentColorIndex = (1 + currentColorIndex) % UI_SAFE_COLORS.length;
    return { payload: { reqRes, color } };
  }
);

const graphPointsSlice = createSlice({
  name: 'graphPoints',
  initialState,
  reducers: {
    //Before toolkit conversion was clearGraph or CLEAR_GRAPH
    groupCleared: (state, action: PayloadAction<number>) => {
      state[action.payload] = [];
    },

    //Before toolkit conversion was clearAllGraph or CLEAR_ALL_GRAPH
    graphCleared: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    //Before toolkit conversino was graphUpdated was updateGraph or UPDATE_GRAPH
    builder.addCase(graphUpdated, (state, action) => {
      const { reqRes, color } = action.payload;

      const { id } = reqRes;
      if (!state[id]) {
        state[id] = [];
      }

      const pointsArray = state[id];
      const previouslySent = pointsArray.some(
        (request) => request.timeSent === reqRes.timeSent
      );

      if (previouslySent) {
        return;
      }

      if (pointsArray.length > 49) {
        state[id] = pointsArray.slice(1);
      }

      pointsArray.push({
        reqRes: reqRes,
        url: reqRes.url,
        timeSent: reqRes.timeSent,
        timeReceived: reqRes.timeReceived,
        createdAt: reqRes.createdAt,
        color: pointsArray?.[0]?.color ?? color,
      });
    });
  },
});

export const { groupCleared, graphCleared } = graphPointsSlice.actions;
export default graphPointsSlice.reducer;

