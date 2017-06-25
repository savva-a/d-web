import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Grid, Form, FormGroup, FormControl, Image } from 'react-bootstrap';
// import FontAwesome from 'react-fontawesome';
// import { browserHistory } from 'react-router';

import * as authActions from '../../redux/auth';
// import * as configActions from '../../redux/config';
// import * as registerActions from '../../redux/register';
// import * as libraryActions from '../../redux/library';
// import * as bookViewerActions from '../../redux/bookViewer';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
// import ColoredScrollbars from '../ColoredScrollBar';
// import Loader from '../Loader';

import words from '../../words';


import staticImages from '../../staticImages';
import API from '../../client-api';

import './Profile.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.onMount = this.onMount.bind(this);
    this.handleOnChangeUserFields = this.handleOnChangeUserFields.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.state = {
      userFieldsChanged: false,
      newPasswordValidation: null,
      firstName: '',
      lastName: '',
      mail: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showLoader: false
    };
  }

  componentDidMount() {
    this.onMount('firstName', this.props.auth.firstName);
    this.onMount('lastName', this.props.auth.lastName);
    this.onMount('mail', this.props.auth.mail);
  }

  onMount(key, value) {
    this.setState({
      [key]: value
    });
  }

  handleOnChangeUserFields = (event) => {
    this.setState({ [event.target.id]: event.target.value, userFieldsChanged: true });
  }

  handleOnChangeNewPassword = (event) => {
    event.persist();
    this.setState({ [event.target.id]: event.target.value }, () => {
      if (event.target.id === 'newPassword' || event.target.id === 'confirmPassword') {
        const regex = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[._,#?!@$%^&*-]).{6,}$/;
        if (regex.test(event.target.value)) {
          this.setState({ newPasswordValidation: 'success' });
        }
        if (this.state.newPassword !== this.state.confirmPassword) {
          this.setState({ newPasswordValidation: 'error' });
        }
      }
    });
  }

  saveProfile() {
    if (this.state.userFieldsChanged) {
      const user = {
        session: this.props.auth.session,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        mail: this.state.mail,
      };
      API.call('user/profile/edit', user)
      .then((result) => {
        this.props.actions.userAuth(result.data);
      });
    }
    if (this.state.oldPassword && (this.state.newPassword === this.state.confirmPassword)) {
      const password = {
        session: this.props.auth.session,
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword
      };
      API.call('user/changePassword', password)
      .then((result) => {
        console.log('password changed', result.data);
        // this.props.actions.userAuth(result.data);
        // smth actions.
      });
    }
  }

  render() {
    const LN = this.props.config.appLanguage;

    return (
      <div className="component-container">
        <HeaderComponent imgName="userWhite" show />
        <Grid className="profile-page" fluid>
          <Row className="profile-header" >
            <div style={{ margin: 'auto' }}>
              {words.profileHeader[LN]}
            </div>
          </Row>
          <Row className="profile-body" >
            <Col xs={8} xsOffset={2}>
              <Form horizontal>
                <FormGroup controlId="firstName">
                  <Col className="profile-input-label" xs={3}>
                    {words.profileFirstName[LN]}
                  </Col>
                  <Col xs={9}>
                    <FormControl
                      placeholder={words.profileFirstName[LN]}
                      value={this.state.firstName}
                      onChange={this.handleOnChangeUserFields}
                    />
                    <FormControl.Feedback />
                  </Col>
                </FormGroup>

                <FormGroup controlId="lastName">
                  <Col className="profile-input-label" xs={3}>
                    {words.profileLastName[LN]}
                  </Col>
                  <Col xs={9}>
                    <FormControl
                      placeholder={words.profileLastName[LN]}
                      value={this.state.lastName}
                      onChange={this.handleOnChangeUserFields}
                    />
                  </Col>
                </FormGroup>

                <FormGroup controlId="mail">
                  <Col className="profile-input-label" xs={3}>
                    {words.profileEmailAddress[LN]}
                  </Col>
                  <Col xs={9}>
                    <FormControl
                      placeholder={words.profileEmailAddress[LN]}
                      value={this.state.mail}
                      onChange={this.handleOnChangeUserFields}
                    />
                  </Col>
                </FormGroup>

                <FormGroup controlId="oldPassword">
                  <Col className="profile-input-label" xs={3}>
                    {words.profileOldPassword[LN]}
                  </Col>
                  <Col xs={9}>
                    <FormControl
                      type="password"
                      placeholder={words.profileOldPassword[LN]}
                      onChange={this.handleOnChangeUserFields}
                    />
                  </Col>
                </FormGroup>

                <FormGroup controlId="newPassword" validationState={this.state.newPasswordValidation}>
                  <Col className="profile-input-label" xs={3}>
                    {words.profileNewPassword[LN]}
                  </Col>
                  <Col xs={9}>
                    <FormControl
                      type="password"
                      placeholder={words.profileNewPassword[LN]}
                      onChange={this.handleOnChangeNewPassword}
                    />
                  </Col>
                </FormGroup>

                <FormGroup controlId="confirmPassword" validationState={this.state.newPasswordValidation}>
                  <Col className="profile-input-label" xs={3}>
                    {words.profileConfirmPassword[LN]}
                  </Col>
                  <Col xs={9}>
                    <FormControl
                      type="password"
                      placeholder={words.profileConfirmPassword[LN]}
                      onChange={this.handleOnChangeNewPassword}
                    />
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword">
                  <Col xs={9} xsOffset={3}>
                    <div className="profile-password-advice" >
                      {words.profilePasswordLength[LN]}
                    </div>
                    <div className="profile-password-advice" >
                      {words.profilePasswordAdvice[LN]}
                    </div>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col xsOffset={1} xs={3} className="profile-extend-label">
              {words.profileDaysLeft[LN]}
            </Col>
            <Col xs={8}>
              007
              <button className="upload-btn upload-btn-disabled" >
                {words.profileExtendSubscription[LN]}
              </button>
              <Image
                src={staticImages.okGreen}
                alt="save"
                height={45}
                className="pullright profile-save-btn"
                onClick={this.saveProfile}
              />
            </Col>
          </Row>
        </Grid>
        <FooterComponent />
      </div>
    );
  }
}

Profile.propTypes = {
  actions: React.PropTypes.shape({
    userAuth: React.PropTypes.func,
  }),
  auth: React.PropTypes.shape({
    session: React.PropTypes.string,
    firstName: React.PropTypes.string,
    lastName: React.PropTypes.string,
    mail: React.PropTypes.string,
  }),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string,
    textLanguage: React.PropTypes.string,
    textSize: React.PropTypes.string,
    lineSpacing: React.PropTypes.string,
  }),
};
Profile.defaultProps = {
  actions: {},
  auth: {
    session: '',
    firstName: '',
    lastName: '',
    mail: '',
  },
  config: {
    appLanguage: 'en',
    textLanguage: 'en',
    textSize: '24',
    lineSpacing: '1',
  },
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({
    ...authActions,
    // ...configActions,
    // ...registerActions,
    // ...bookViewerActions,
    // ...libraryActions
  }, dispatch) })
)(Profile);
