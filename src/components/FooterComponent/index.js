import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Overlay, OverlayTrigger, Image } from 'react-bootstrap';

import * as editorActions from '../../redux/editor';

import words from '../../words';
import staticImages from '../../staticImages';
import CustomPopover from '../CustomPopover';

import './FooterComponent.scss';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...editorActions }, dispatch) })
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
      <div className={this.props.inactive ? 'bottom-bar inactive' : 'bottom-bar'}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={userSkillPopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={staticImages.bottomQuestion}
              height="20"
              alt="bottomQuestion"
              onClick={this.props.showUserLvlModal}
              className="pointer bottom-bar-img"
            />

          </OverlayTrigger>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <img src={staticImages.starEmpty} alt="emptyStar" className="userlevel-star" />
            <div
              onClick={this.props.decreaseUserLevel}
              className="userlevel-arrow"
            > ◄ </div>
            <input
              className="user-level"
              type="range"
              max={100}
              min={0}
              step={1}
              // defaultValue={0.7}
              value={this.props.userLevelValue}
              onChange={this.props.setUserLevel}
            />
            <div
              onClick={this.props.increaseUserLevel}
              className="userlevel-arrow"
            > ► </div>
            <img src={staticImages.star} alt="emptyStar" className="userlevel-star" />
          </div>
        </div>
        <div className="bottom-bar-controls">
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={speechToTextPopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={this.props.sttIsActive ? staticImages.bottomSttOn : staticImages.bottomSttOff}
              height="60"
              alt="bottomSttOff"
              onClick={this.props.active ? this.props.speechToText : () => {}}
              className="pointer bottom-bar-img"
            />
          </OverlayTrigger>

          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={nextLinePopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={staticImages.bottomNext}
              height="60" alt="bottomNext"
              onClick={this.props.active ? this.props.nextSentence : () => {}}
              className="pointer bottom-bar-img"
            />
          </OverlayTrigger>

          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={prevLinePopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={staticImages.bottomPrev}
              height="60"
              alt="bottomPrev"
              onClick={this.props.active ? this.props.prevSentence : () => {}}
              className="pointer bottom-bar-img"
            />
          </OverlayTrigger>

          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={hearTextPopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={this.props.ttsIsActive ? staticImages.bottomTtsOn : staticImages.bottomTtsOff}
              height="60"
              alt="bottomTtsOff"
              onClick={this.props.active ? this.props.textToSpeech : () => {}}
              className="pointer bottom-bar-img"
            />
          </OverlayTrigger>

          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={saveTextPopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={staticImages.bottomSave}
              height="60"
              alt="bottomSave"
              onClick={this.props.active || this.props.activeSave ? this.props.saveText : () => {}}
              className="pointer bottom-bar-img"
            />
          </OverlayTrigger>

          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={feedbackPopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={this.props.feedbackIsActive ? staticImages.bottomFeedbackGeen : staticImages.bottomFeedback}
              height="60"
              alt="bottomFeedback"
              onClick={this.props.active ? this.props.feedback : () => {}}
              className="pointer bottom-bar-img"
            />
          </OverlayTrigger>
        </div>
        <img src={staticImages.doobee3} height="60" alt="DooBee logo" className="bottom-bar-logo" />
      </div>
    );
  }
}

FooterComponent.propTypes = {
  active: React.PropTypes.bool,
  activeSave: React.PropTypes.bool,
  saveText: React.PropTypes.func,
  sttIsActive: React.PropTypes.bool,
  ttsIsActive: React.PropTypes.bool,
  feedbackIsActive: React.PropTypes.bool,
  inactive: React.PropTypes.bool,
  speechToText: React.PropTypes.func,
  textToSpeech: React.PropTypes.func,
  prevSentence: React.PropTypes.func,
  nextSentence: React.PropTypes.func,
  feedback: React.PropTypes.func,
  showUserLvlModal: React.PropTypes.func,
  setUserLevel: React.PropTypes.func,
  decreaseUserLevel: React.PropTypes.func,
  increaseUserLevel: React.PropTypes.func,
  userLevelValue: React.PropTypes.number,
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  })
};
FooterComponent.defaultProps = {
  active: false,
  activeSave: false,
  actions: {},
  speechToText: () => {},
  saveText: () => {},
  textToSpeech: () => {},
  prevSentence: () => {},
  nextSentence: () => {},
  feedback: () => {},
  showUserLvlModal: () => {},
  setUserLevel: () => {},
  decreaseUserLevel: () => {},
  increaseUserLevel: () => {},
  userLevelValue: 50,
  sttIsActive: false,
  ttsIsActive: false,
  feedbackIsActive: false,
  inactive: false,
  config: { appLanguage: 'en' }
};

export default FooterComponent;
