import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Grid } from 'react-bootstrap';
// import FontAwesome from 'react-fontawesome';
// import { browserHistory } from 'react-router';

import * as configActions from '../../redux/config';
import * as registerActions from '../../redux/register';
import * as libraryActions from '../../redux/library';
import * as bookViewerActions from '../../redux/bookViewer';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
// import ColoredScrollbars from '../ColoredScrollBar';
// import Loader from '../Loader';

import words from '../../words';


import staticImages from '../../staticImages';

// import API from '../../client-api';

import './Settings.scss';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({
    ...configActions,
    ...registerActions,
    ...bookViewerActions,
    ...libraryActions
  }, dispatch) })
)

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
    this.onChangeFontSize = this.onChangeFontSize.bind(this);
    this.onChangeLineSpacing = this.onChangeLineSpacing.bind(this);
    this.state = {
      showLoader: false
    };
  }

  componentDidMount() {
  }

  onChangeLanguage(e) {
    this.props.actions.setTextLanguage(e.target.value);
  }
  onChangeFontSize(e) {
    this.props.actions.setTextFontSize(e.target.value);
  }

  onChangeLineSpacing(e) {
    this.props.actions.setTextLineSpacing(e.target.value);
  }

  render() {
    const LN = this.props.config.appLanguage;

    return (
      <div className="component-container">
        <HeaderComponent imgName="cogWhite" show />
        <Grid className="settings-page" fluid>
          <Row className="settings-header" >
            <Col xs={4} className="settings-item settings-header-item" >
              <div >
                <img alt={words.settingsLanguage[LN]} src={staticImages.settingsIcon1} className="setting-logo" />
                {words.settingsLanguage[LN]}
              </div>
            </Col>
            <Col xs={4} className="settings-item settings-header-item" >
              <Row>
                <img alt={words.settingsFont[LN]} src={staticImages.settingsIcon2} className="setting-logo" />
                {words.settingsFont[LN]}
              </Row>
            </Col>
            <Col xs={4} className="settings-item settings-header-item" >
              <Row>
                <img alt={words.settingsLineSpacing[LN]} src={staticImages.settingsIcon3} className="setting-logo" />
                {words.settingsLineSpacing[LN]}
              </Row>
            </Col>
          </Row>
          <Row className="settings-body" >
            <Col xs={4} className="settings-item" >
              <select onChange={this.onChangeLanguage} value={this.props.config.textLanguage}>
                <option value="en-US">English US</option>
                <option value="en-GB">English GB</option>
                <option value="en">English</option>
                <option value="da-DK">Danish</option>
                <option value="nl-NL">Dutch</option>
                <option value="de">German(1)</option>
                <option value="de-DE">German(2)</option>
                <option value="fr">French</option>
                <option value="ru">Russian</option>
                <option value="pl">Polish</option>
                <option value="uk-UA">Ukrainian</option>
              </select>
            </Col>
            <Col xs={4} className="settings-item" >
              <select onChange={this.onChangeFontSize} value={this.props.config.textSize}>
                <option value="24px">small</option>
                <option value="34px">medium</option>
                <option value="44px">large</option>
              </select>
            </Col>
            <Col xs={4} className="settings-item" >
              <select onChange={this.onChangeLineSpacing} value={this.props.config.lineSpacing}>
                <option value="1">small</option>
                <option value="1.5">medium</option>
                <option value="2">large</option>
              </select>
            </Col>
          </Row>
        </Grid>
        <FooterComponent />
      </div>
    );
  }
}

Settings.propTypes = {
  actions: React.PropTypes.shape({
    setTextLanguage: React.PropTypes.func,
    setTextFontSize: React.PropTypes.func,
    setTextLineSpacing: React.PropTypes.func,
  }),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string,
    textLanguage: React.PropTypes.string,
    textSize: React.PropTypes.string,
    lineSpacing: React.PropTypes.string,
  }),
};
Settings.defaultProps = {
  actions: {},
  config: {
    appLanguage: 'en',
    textLanguage: 'en',
    textSize: '24',
    lineSpacing: '1',
  },
};

export default Settings;
