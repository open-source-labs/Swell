import { createSlice } from '@reduxjs/toolkit';

const mockServerSlice = createSlice({
  name: 'mockServer',
  initialState: {
    isServerStarted: false,
  },
  reducers: {
    startServer: (state) => {
      state.isServerStarted = true;
    },
    stopServer: (state) => {
      state.isServerStarted = false;
    },
  },
});

export const { startServer, stopServer } = mockServerSlice.actions;

export default mockServerSlice.reducer;