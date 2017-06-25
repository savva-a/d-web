import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import HomePage from './components/HomePage';
import Library from './components/Library';
import Editor from './components/Editor';
import Upload from './components/Upload';
import Viewer from './components/Viewer';
import Settings from './components/Settings';
import Terms from './components/Terms';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Profile from './components/Profile';
import Component1 from './components/Component1';
import Component2 from './components/Component2';

import NotFound from './components/NotFound';

export default (
// const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/library" component={Library} />
    <Route path="/copyPaste" component={Editor} />
    <Route path="/upload" component={Upload} />
    <Route path="/viewer" component={Viewer} />
    <Route path="/settings" component={Settings} />
    <Route path="/terms-and-conditions" component={Terms} />
    <Route path="/faq" component={Faq} />
    <Route path="/contact" component={Contact} />
    <Route path="/profile" component={Profile} />
    <Route path="/component1" component={Component1} />
    <Route path="/component2" component={Component2} />
    <Route path="*" component={NotFound} />
  </Route>
);

// export default routes;
