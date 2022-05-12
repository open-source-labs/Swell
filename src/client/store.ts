import { configureStore } from '@reduxjs/toolkit'

import businessReducer from './features/business/businessSlice'
import uiReducer from './features/ui/uiSlice'

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