import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Modal, Image, Checkbox, Col, Row } from 'react-bootstrap';

import * as authActions from '../../redux/auth';
import * as configActions from '../../redux/config';

import Loader from '../Loader';

import words from '../../words';
import staticImages from '../../staticImages';
import API from '../../client-api';

import Storage from '../../Storage';

import './LoginModal.scss';

class LoginModal extends React.Component {

  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.loginClick = this.loginClick.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.state = {
      showLoader: false,
      showLogin: true,
      stayLoggedIn: true
    };
  }

  handleInput(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleCheckbox() {
    this.setState({
      stayLoggedIn: !this.state.stayLoggedIn
    });
  }

  loginClick() {
    this.setState({
      showLoader: true
    });
    const data = {
      mail: this.state.email,
      password: this.state.password,
    };
    API.call('user/login', data).then((result) => {
      if (result.status === 'success') {
        Storage.set('session', result.data.session);
        this.props.actions.userAuth({ ...result.data });
        this.props.onHide();
      }
      this.setState({
        showLoader: false
      });
      if (result.status !== 'success') {
        console.log(result.data.msg); // eslint-disable-line no-console
      }
    });
  }

  logoutClick() {
    Storage.set('session', '');
    this.props.onHide();
    setTimeout(() => {
      this.props.actions.userUnsign();
    }, 150); // blink new render in modal
  }

  render() {
    const LN = this.props.config.appLanguage;
    return (
      <Modal
        dialogClassName="login-modal-dialog"
        show={this.props.show}
        onHide={this.props.onHide}
      >
        {!this.props.auth.session ?
          <div>
            <Loader show={this.state.showLoader} style={{ left: '30%', top: '30%', transform: 'none' }} />
            <Col xs={10}>
              <Row>
                <input
                  placeholder={words.email[LN]}
                  className="login-modal-input"
                  onChange={this.handleInput}
                  id="email"
                />
              </Row>
              <Row>
                <input
                  placeholder={words.password[LN]}
                  className="login-modal-input password"
                  onChange={this.handleInput}
                  type="password"
                  id="password"
                />
              </Row>
              <Row>
                <span className="pullright login-modal-forgot-label">{words.forgotPassword[LN]}</span>
              </Row>

              <Row>
                <Checkbox checked={this.state.stayLoggedIn} onChange={this.handleCheckbox}>
                  {words.stayLoggedIn[LN]}
                </Checkbox>
              </Row>
              <Row style={{ display: 'flex' }}>
                <div className="login-btn-label">{words.loginWithUNILogin[LN]}</div>
                <button onClick={this.loginClick} className="login-btn">{words.login[LN]}</button>
              </Row>
            </Col>
            <Col xs={2}>
              <Image src={staticImages.iconCloseCircled} className="login-modal-close" onClick={this.props.onHide} />
            </Col>
          </div>
        : <button onClick={this.logoutClick} className="login-btn logout-btn">{words.logout[LN]}</button>
        }
      </Modal>
    );
  }
}

LoginModal.propTypes = {
  show: React.PropTypes.bool,
  onHide: React.PropTypes.func,
  actions: React.PropTypes.shape({
    userAuth: React.PropTypes.func,
    userUnsign: React.PropTypes.func,
  }),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  }),
  auth: React.PropTypes.shape({
    session: React.PropTypes.string
  })

};
LoginModal.defaultProps = {
  actions: {},
  children: {},
  show: false,
  onHide: () => {},
  userUnsign: () => {},
  config: { appLanguage: 'en' },
  auth: { session: '' }
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({
    ...authActions,
    ...configActions }, dispatch) })
)(LoginModal);
