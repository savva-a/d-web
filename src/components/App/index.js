import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { browserHistory } from 'react-router';

import { Grid, Row, ButtonToolbar, DropdownButton, MenuItem, Overlay } from 'react-bootstrap';

import FontAwesome from 'react-fontawesome';

import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';
import * as configActions from '../../redux/config';

import words from '../../words';


import CustomPopover from '../CustomPopover';

// import mergeDeep from '../../utils/mergeDeep';

import './App.scss';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({
    ...counterActions,
    ...registerActions,
    ...configActions }, dispatch) })
)

class App extends React.Component {

  constructor(props) {
    super(props);
    this.togglePopover = this.togglePopover.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
    this.renderNavIcon = this.renderNavIcon.bind(this);
    this.state = {
      popoversShow: {
        languagePopover: false,
        home: false,
        login: false,
        userProfile: false,
        shoppingCart: false
      },
    };
  }

  togglePopover(targetName, value) {
    const state = this.state;
    state.popoversShow[targetName] = value;
    this.setState(state);
  }

  renderNavIcon(ref, name, route, style) {
    // const spanStyle = {
    //   margin: ' 5px'
    // };
    return (
      // <span style={mergeDeep(spanStyle, style)}>
      <span
        style={style}
        className="nav-icon pointer"
        ref={(c) => { this[ref] = c; }}
        onMouseOver={() => { this.togglePopover(ref, true); }}
        onMouseLeave={() => { this.togglePopover(ref, false); }}
      >
        <FontAwesome name={name} fixedWidth size="lg" onClick={() => { browserHistory.push(route); }} />
      </span>
    );
  }

  renderOverlay(elementName) {
    const LN = this.props.config.appLanguage;
    return (
      <Overlay
        show={this.state.popoversShow[elementName]}
        placement="bottom"
        container={this}
        target={this[elementName]}
      >
        <CustomPopover text={words[elementName][LN]} />
      </Overlay>
    );
  }

  render() {
    const LN = this.props.config.appLanguage;
    return (
      <Grid fluid>
        <Row className="NavBar horizontal">
          <ButtonToolbar>
            <DropdownButton bsStyle="link" title={<FontAwesome name="info-circle" size="2x" />} noCaret id="dropdown-no-caret" className="nav-icon no-padding">
              <MenuItem eventKey="1">{words.faq[LN]}</MenuItem>
              <MenuItem eventKey="2">{words.tc[LN]}</MenuItem>
              <MenuItem eventKey="3">{words.contact[LN]}</MenuItem>
            </DropdownButton>
            <DropdownButton
              bsStyle="link"
              title={<FontAwesome name="globe" size="2x" />}
              noCaret
              id="dropdown-no-caret"
              className="nav-icon no-padding"
              ref={(c) => { this.languagePopover = c; }}
              onMouseOver={() => { this.togglePopover('languagePopover', true); }}
              onMouseLeave={() => { this.togglePopover('languagePopover', false); }}
            >
              <MenuItem eventKey="1" onClick={() => { this.props.actions.setAppLanguage('en'); }}>language EN</MenuItem>
              <MenuItem eventKey="2" onClick={() => { this.props.actions.setAppLanguage('ru'); }}>language RU</MenuItem>
            </DropdownButton>
          </ButtonToolbar>

          {this.renderNavIcon('homePopover', 'home', '/', { marginLeft: 'auto' })}
          {this.renderNavIcon('libraryPopover', 'book', '/library')}
          {this.renderNavIcon('settingsPopover', 'cog', '/settings')}
          {this.renderNavIcon('loginPopover', 'unlock-alt', '/component1')}
          {this.renderNavIcon('userProfilePopover', 'user', '/component2')}
          {this.renderNavIcon('shoppingCartPopover', 'shopping-cart', '/component2')}
        </Row>
        <Row>
          {this.props.children}
        </Row>
        {this.renderOverlay('languagePopover')}
        {this.renderOverlay('homePopover')}
        {this.renderOverlay('libraryPopover')}
        {this.renderOverlay('settingsPopover')}
        {this.renderOverlay('loginPopover')}
        {this.renderOverlay('userProfilePopover')}
        {this.renderOverlay('shoppingCartPopover')}

      </Grid>
    );
  }
}

App.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func,
    setAppLanguage: React.PropTypes.func
  }),
  children: React.PropTypes.shape(),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  })

};
App.defaultProps = {
  actions: {},
  children: {},
  config: { appLanguage: 'en' }
};

export default App;
