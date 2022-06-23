import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReqRes, $TSFixMe } from '../../../types';

//type of objects inside array of objects for each id key
type GraphPoint = {
  reqRes: ReqRes;
  url: string;
  timeSent: number;
  timeReceived: Date | number;
  createdAt: Date;
  color: string;
};

//"GraphRecord" was previously named "DataPoints"
type GraphRecord = Record<ReqRes['id'], GraphPoint[]>;
// shape of graphPoints object {
//   id1: [array of graph points entry objects],
//   id2: [array of graph points entry objects],
//   etc
// }

const initialState: GraphRecord = {};

export const GraphPointsSlice = createSlice({
  name: 'graphPoints',
  initialState,
  reducers: {
    updateGraph: (state, action) => {
      // action.payload is the latest reqRes object (ReqRes type)
      const { id } = action.payload;
      // if more than 8 points, data will shift down an index
      if (!state[id]) {
        state[id] = [];
      } else if (state[id].length > 49) {
        state[id] = state[id].slice(1);
      }
      // check if new object is a closed request with timeSent and timeReceived
      if (
        !state[id].some(
          (elem: $TSFixMe) => elem.timeSent === action.payload.timeSent
        )
      ) {
        // if a color hasn't been added to this specific request id, add a new one
        const color = !state[id][0]?.color
          ? /**
             * @todo change this part below - math.random produces side effects
             */
            `${Math.random() * 256}, ${Math.random() * 256}, ${
              Math.random() * 256
            }`
          : state[id][0].color;

        // add graphPoint to array connected to its id
        state[id].push({
          reqRes: action.payload,
          url: action.payload.url,
          timeSent: action.payload.timeSent,
          timeReceived: action.payload.timeReceived,
          createdAt: action.payload.createdAt,
          color,
        });
      }
    },
    clearGraph: (state, action) => {
      state[action.payload] = [];
    },
    clearAllGraph: (state) => {
      state = {};
    },
  },
});

