import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
// import thunk from 'redux-thunk';
// import createLogger from 'redux-logger';
import throttle from 'lodash/throttle';

import register from './register';
import counter from './counter';
import library from './library';
import config from './config';
import bookViewer from './bookViewer';
import editor from './editor';
import auth from './auth';

import { loadState, saveState } from './localStorage';

const persistedStore = loadState();

// ////////////////////////////////////////////////
const store = createStore(
  combineReducers({
    routing,
    register,
    counter,
    library,
    editor,
    bookViewer,
    config,
    auth,
  }),
  persistedStore,
  window.devToolsExtension ? window.devToolsExtension() : f => f,
  // applyMiddleware(routerReducer)
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    // process.env.NODE_ENV === 'production'
    //     ? applyMiddleware(thunk)
    //     : applyMiddleware(thunk, logger)
);

store.subscribe(throttle(() => {
  saveState({
    config: store.getState().config
  });
}, 1000));

export default store;
