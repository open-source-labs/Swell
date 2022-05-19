import { configureStore } from '@reduxjs/toolkit'

import businessReducer from './features/business/businessSlice'
import uiReducer from './features/ui/uiSlice'

// ********************************
// * The Redux store is setup in modern Redux Toolkit style
// * https://redux-toolkit.js.org/
// * TODO: Date objects are being stored in redux which is 
// * illegal but doesn't break anything. Refactor to 
// * only store plain objects to remove serializableCheck
// ********************************

const store = configureStore({
  reducer: {
    business: businessReducer,
    ui: uiReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,  
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store