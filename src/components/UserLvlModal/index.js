import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Modal, Image } from 'react-bootstrap';
// import FontAwesome from 'react-fontawesome';

import * as authActions from '../../redux/auth';
import * as configActions from '../../redux/config';

import words from '../../words';
import staticImages from '../../staticImages';

import './UserLvlModal.scss';

class UserLvlModal extends React.Component {

  constructor(props) {
    super(props);
    // this.handleCheckbox = this.handleCheckbox.bind(this);
    this.state = {
      showLoader: false,
      stayLoggedIn: true
    };
  }

  render() {
    const LN = this.props.config.appLanguage;
    return (
      <Modal
        dialogClassName="userlvl-modal-dialog"
        show={this.props.show}
        onHide={this.props.onHide}
      >
        <div className="userlvl-modal">
          <Image
            src={staticImages.iconCloseCircled}
            height="40"
            width="40"
            alt="copyPaste"
            onClick={this.props.onHide}
            className="userlvl-modal__close"
          />
          <span className="userlvl-modal__text" >
            {words.userLvlText1[LN]}
            <Image src={staticImages.starHalfBlack} height="16" />
            {words.userLvlText2[LN]}
            <Image src={staticImages.starBlack} height="16" />
            {words.userLvlText3[LN]}
          </span>
          <Image
            src={staticImages.doobee3}
            height="40"
            className="userlvl-modal__logo"
            onClick={this.props.onHide}
          />
        </div>
      </Modal>
    );
  }
}

UserLvlModal.propTypes = {
  show: React.PropTypes.bool,
  onHide: React.PropTypes.func,
  // actions: React.PropTypes.shape({
  //   userAuth: React.PropTypes.func,
  //   userUnsign: React.PropTypes.func,
  // }),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  }),
  // auth: React.PropTypes.shape({
  //   session: React.PropTypes.string
  // })

};
UserLvlModal.defaultProps = {
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
)(UserLvlModal);
