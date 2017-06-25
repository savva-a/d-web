import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { browserHistory } from 'react-router';

import { Grid, Row, ButtonToolbar, DropdownButton, MenuItem, Overlay, OverlayTrigger, Image } from 'react-bootstrap';

import * as authActions from '../../redux/auth';
import * as configActions from '../../redux/config';

import words from '../../words';
import staticImages from '../../staticImages';
import API from '../../client-api';

import SessionService from '../SessionService';
import CustomPopover from '../CustomPopover';
import LoginModal from '../LoginModal';
import Storage from '../../Storage';

import './App.scss';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.togglePopover = this.togglePopover.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
    this.renderNavIcon = this.renderNavIcon.bind(this);
    this.closeLoginModal = this.closeLoginModal.bind(this);
    this.state = {
      popoversShow: {
        showLoginModal: true,
        languagePopover: false,
        home: false,
        login: false,
        userProfile: false,
        shoppingCart: false
      },
    };
  }

  componentWillMount() {
    const session = Storage.get('session');
    if (session) {
      API.call('user/check', {
        session
      }).then((_result) => {
        const result = _result;
        result.data.session = session;
        this.props.actions.userAuth({ ...result.data });
      });
    }
  }

  closeLoginModal() {
    this.setState({
      showLoginModal: false
    });
  }

  togglePopover(targetName, value) {
    const state = this.state;
    state.popoversShow[targetName] = value;
    this.setState(state);
  }

  renderNavIcon(ref, name, route, style) {
    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="bottom"
        overlay={ref}
        delayShow={0}
        delayHide={0}
      >
        <span
          style={style}
          className="nav-icon pointer"
          ref={(c) => { this[ref] = c; }}
          onMouseOver={() => { this.togglePopover(ref, true); }}
          onMouseLeave={() => { this.togglePopover(ref, false); }}
        >
          <Image
            src={staticImages[name]}
            height="25"
            onClick={() => { browserHistory.push(route); }}
            alt={name}
            className="top-bar-img"
          />
        </span>
      </OverlayTrigger>
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

    const languagePopover = (
      <CustomPopover text={words.languagePopover[LN]} />
    );
    const homePopover = (
      <CustomPopover text={words.homePopover[LN]} />
    );
    const libraryPopover = (
      <CustomPopover text={words.libraryPopover[LN]} />
    );
    const settingsPopover = (
      <CustomPopover text={words.settingsPopover[LN]} />
    );
    const loginPopover = (
      <CustomPopover text={words.loginPopover[LN]} />
    );
    const userProfilePopover = (
      <CustomPopover text={words.userProfilePopover[LN]} />
    );
    const shoppingCartPopover = (
      <CustomPopover text={words.shoppingCartPopover[LN]} />
    );
    return (
      <Grid>
        <Row className="NavBar horizontal">
          <ButtonToolbar className="navbar-toolbar">
            <DropdownButton
              bsStyle="link"
              title={<img src={staticImages.info} height="25" alt="info" className="top-bar-img" />}
              noCaret
              id="dropdown-no-caret"
              className="nav-icon no-padding"
            >
              <MenuItem eventKey="1" onClick={() => { browserHistory.push('/faq'); }}>
                {words.faq[LN]}
              </MenuItem>
              <MenuItem eventKey="2" onClick={() => { browserHistory.push('/terms-and-conditions'); }}>
                {words.tc[LN]}
              </MenuItem>
              <MenuItem eventKey="3" onClick={() => { browserHistory.push('/contact'); }}>
                {words.contact[LN]}
              </MenuItem>
            </DropdownButton>
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="bottom"
              overlay={languagePopover}
              delayShow={0}
              delayHide={0}
            >
              <DropdownButton
                bsStyle="link"
                title={<img src={staticImages.world} height="25" alt="info" className="top-bar-img" />}
                noCaret
                id="dropdown-no-caret"
                className="nav-icon no-padding"
              >
                <MenuItem
                  eventKey="1"
                  onClick={() => { this.props.actions.setAppLanguage('en'); }}
                >language EN</MenuItem>
                <MenuItem
                  eventKey="2"
                  onClick={() => { this.props.actions.setAppLanguage('ru'); }}
                >language RU</MenuItem>
                <MenuItem
                  eventKey="3"
                  onClick={() => { this.props.actions.setAppLanguage('dan'); }}
                >language DA</MenuItem>
              </DropdownButton>
            </OverlayTrigger>
          </ButtonToolbar>

          {this.renderNavIcon(homePopover, 'home', '/', { marginLeft: 'auto' })}
          {this.renderNavIcon(libraryPopover, 'book', '/library')}
          {this.renderNavIcon(settingsPopover, 'cog', '/settings')}

          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="bottom"
            overlay={loginPopover}
            delayShow={0}
            delayHide={0}
          >
            <span className="nav-icon pointer">
              <Image
                src={this.props.auth && this.props.auth.session ? staticImages.unlockAlt : staticImages.lockAlt}
                height="25"
                onClick={() => {
                  this.setState({
                    showLoginModal: !this.state.showLoginModal
                  });
                }}
                alt="login"
                className="top-bar-img"
              />
            </span>
          </OverlayTrigger>
          {this.renderNavIcon(userProfilePopover, 'user', '/profile')}
          {this.renderNavIcon(shoppingCartPopover, 'shoppingCart', '/component2')}
        </Row>
        <Row>
          <SessionService>
            {this.props.children}
          </SessionService>
        </Row>
        <LoginModal show={this.state.showLoginModal} onHide={this.closeLoginModal} />
      </Grid>
    );
  }
}

App.propTypes = {
  actions: React.PropTypes.shape({
    userAuth: React.PropTypes.func,
    setAppLanguage: React.PropTypes.func
  }),
  children: React.PropTypes.shape(),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  }),
  auth: React.PropTypes.shape({
    session: React.PropTypes.string
  })

};
App.defaultProps = {
  actions: {},
  children: {},
  config: { appLanguage: 'en' },
  auth: { session: '' }
};


export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({
    ...authActions,
    ...configActions }, dispatch) })
)(App);
