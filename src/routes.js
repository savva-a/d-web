import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import HomePage from './components/HomePage';
import Library from './components/Library';
import CopyPaste from './components/CopyPaste';
import Upload from './components/Upload';
import Component1 from './components/Component1';
import Component2 from './components/Component2';

import NotFound from './components/NotFound';


export default (
// const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/library" component={Library} />
    <Route path="/copyPaste" component={CopyPaste} />
    <Route path="/upload" component={Upload} />
    <Route path="/component1" component={Component1} />
    <Route path="/component2" component={Component2} />
    <Route path="*" component={NotFound} />
  </Route>
);

// export default routes;
