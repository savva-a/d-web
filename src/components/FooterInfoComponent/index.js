import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Overlay, OverlayTrigger } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import staticImages from '../../staticImages';

import * as editorActions from '../../redux/editor';

import words from '../../words';
// import CustomPopover from '../CustomPopover';

import './FooterInfoComponent.scss';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...editorActions }, dispatch) })
)

class FooterInfoComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.togglePopover = this.togglePopover.bind(this);
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

  render() {
    const LN = this.props.config.appLanguage;

    return (
      <div className="bottom-info-bar">
        {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>*/}
          <div className="footer-info-text">
            ©2017. Team DooBee IVS, Denmark - Provide Skills to People
          </div>

          <img src={staticImages.doobeeLogo} alt="DooBee logo" className="footer-info-doobee-logo" />

          <div className="footer-info-text">
            Developed withsupport from the Danish Ministry of Education
          </div>

        {/*</div>*/}
      </div>
    );
  }
}

FooterInfoComponent.propTypes = {
  actions: React.PropTypes.shape({
    showSaveTextModal: React.PropTypes.func,
    increment: React.PropTypes.func
  }),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  })
  // editor: React.PropTypes.shape({
  //   showModal: React.PropTypes.string
  // })
};
FooterInfoComponent.defaultProps = {
  active: true,
  actions: {},
  // editor: {
  //   showModal: false
  // },
  config: { appLanguage: 'en' }
};

export default FooterInfoComponent;
