import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Store from './redux';
import routes from './routes';

const history = syncHistoryWithStore(browserHistory, Store);

ReactDOM.render(
  <Provider store={Store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('container')
);
