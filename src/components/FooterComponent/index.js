import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Overlay, OverlayTrigger } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import * as counterActions from '../../redux/counter';

import words from '../../words';
import CustomPopover from '../CustomPopover';

import './FooterComponent.scss';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions }, dispatch) })
)

class FooterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.togglePopover = this.togglePopover.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
    this.state = {
      popoversShow: {
        userSkillPopover: false,
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

    const userSkillPopover = (
      <CustomPopover text={words.userSkillPopover[LN]} />
    );
    const speechToTextPopover = (
      <CustomPopover text={words.speechToTextPopover[LN]} />
    );
    const nextLinePopover = (
      <CustomPopover text={words.nextLinePopover[LN]} />
    );
    const prevLinePopover = (
      <CustomPopover text={words.prevLinePopover[LN]} />
    );
    const hearTextPopover = (
      <CustomPopover text={words.hearTextPopover[LN]} />
    );
    const saveTextPopover = (
      <CustomPopover text={words.saveTextPopover[LN]} />
    );
    const feedbackPopover = (
      <CustomPopover text={words.feedbackPopover[LN]} />
    );

    return (
      <div className="bottom-bar">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={userSkillPopover}>
            <FontAwesome
              name="question-circle"
              size="lg"
              onClick={() => { console.log('show modal with info'); }}
              className="pointer"
            />
          </OverlayTrigger>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input type="range" />
            <input type="range" />
          </div>
        </div>
        <div>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={speechToTextPopover}>
            <FontAwesome name="comment" fixedWidth size="3x" onClick={() => {}} className="pointer" />
          </OverlayTrigger>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={nextLinePopover}>
            <FontAwesome name="arrow-circle-o-down" fixedWidth size="3x" onClick={() => {}} className="pointer" />
          </OverlayTrigger>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={prevLinePopover}>
            <FontAwesome name="arrow-circle-o-up" fixedWidth size="3x" onClick={() => {}} className="pointer" />
          </OverlayTrigger>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={hearTextPopover}>
            <FontAwesome name="headphones" fixedWidth size="3x" onClick={() => {}} className="pointer" />
          </OverlayTrigger>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={saveTextPopover}>
            <FontAwesome name="floppy-o" fixedWidth size="3x" onClick={() => {}} className="pointer" />
          </OverlayTrigger>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={feedbackPopover}>
            <FontAwesome name="retweet" fixedWidth flip="horizontal" size="3x" onClick={() => {}} className="pointer" />
          </OverlayTrigger>
        </div>
        <div>
          <FontAwesome name="database" fixedWidth flip="horizontal" size="3x" onClick={() => {}} className="pointer" />
          DB
        </div>
      </div>
    );
  }
}

FooterComponent.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func
  }),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  })
};
FooterComponent.defaultProps = {
  active: true,
  actions: {},
  config: { appLanguage: 'en' }
};

export default FooterComponent;
