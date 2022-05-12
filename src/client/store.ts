// import { createStore } from 'redux';
// import { composeWithDevTools } from '@redux-devtools/extension';
// import reducers from './reducers/rootReducer';

// // we are adding composeWithDevTools here to get easy access to the Redux dev tools
// const store = createStore(reducers, composeWithDevTools());

// export default store;


import { configureStore } from '@reduxjs/toolkit'

import businessReducer from './features/business/businessSlice'
import uiReducer from './features/ui/uiSlice'

// import businessReducer from './reducers/business';
// import uiReducer from './reducers/ui';

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