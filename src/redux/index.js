import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

// import thunk from 'redux-thunk';
// import createLogger from 'redux-logger';

import register from './register';
import counter from './counter';
import library from './library';
import config from './config';

// const logger = createLogger();

// ////////////////////////////////////////////////
const store = createStore(
  combineReducers({
    routing,
    register,
    counter,
    library,
    config
  }),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
  // applyMiddleware(routerReducer)
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    // process.env.NODE_ENV === 'production'
    //     ? applyMiddleware(thunk)
    //     : applyMiddleware(thunk, logger)
);

export default store;

// ////////////////////////////////////////////////
// export default function configureStore(initialState) {
//   const middleware = [];
//
//   const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//
//   const store = createStore(
//     combineReducers({
//       register,
//       counter
//     }),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
//     initialState,
//     composeEnhancers(applyMiddleware(...middleware))
//     // compose(applyMiddleware(...middleware))
//   );
//
//
//   return store;
// }
