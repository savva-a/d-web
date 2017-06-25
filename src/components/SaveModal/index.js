import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Modal, Image } from 'react-bootstrap';
// import FontAwesome from 'react-fontawesome';

import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';
import * as libraryActions from '../../redux/library';
import * as editorActions from '../../redux/editor';

// import HeaderComponent from '../HeaderComponent';
// import FooterComponent from '../FooterComponent';

import staticImages from '../../staticImages';
import words from '../../words';


import API from '../../client-api';

import './SaveModal.scss';



class SaveModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextEdit = this.handleTextEdit.bind(this);
    this.closeSaveTextModal = this.closeSaveTextModal.bind(this);
    this.handleSaveTextName = this.handleSaveTextName.bind(this);
    this.showModal = this.showModal.bind(this);
    this.saveText = this.saveText.bind(this);
    this.state = {
      a: 1
    };
  }

  handleTextEdit(e) {
    this.props.actions.editText(e.target.value);
  }

  closeSaveTextModal() {
    this.props.actions.showSaveTextModal(false);
  }

  handleSaveTextName(e) {
    this.setState({
      fileName: e.target.value
    });
  }

  saveText() {
    const data = {
      session: this.props.auth.session,
      text: this.props.editor.text,
      name: this.state.fileName
    };
    API.call('book/save', data)
    .then(() => {
      this.props.actions.showSaveTextModal(false);
      this.editorText.value = '';
      browserHistory.push('/library');
    });
  }

  showModal() {
    this.props.actions.showSaveTextModal(true);
  }

  render() {
    const LN = this.props.config.appLanguage;

    return (
      <Modal
        show={this.props.editor.showModal}
        onHide={this.closeSaveTextModal}
      >
        <div className="text-save-modal">
          <Image
            src={staticImages.iconCloseCircled}
            height="40"
            width="40"
            alt="copyPaste"
            onClick={this.closeSaveTextModal}
            className="text-save-modal__close"
          />
          <span
            className="text-save-modal__title"
          >
            {words.saveTextModal[LN]}
          </span>
          <input
            placeholder={words.fileSavePlaceholder[LN]}
            onChange={this.handleSaveTextName}
            className="text-save-modal__input"
          />
          <Image
            src={staticImages.saveIconGreen}
            alt="OK"
            height="48"
            className="text-save-modal__submit"
            onClick={this.saveText}
          />
        </div>
      </Modal>

    );
  }
}

SaveModal.propTypes = {
  actions: React.PropTypes.shape({
    editText: React.PropTypes.func,
    showSaveTextModal: React.PropTypes.func
  }),
  editor: React.PropTypes.shape({
    text: React.PropTypes.string,
    showModal: React.PropTypes.bool
  }),
  auth: React.PropTypes.shape({
    session: React.PropTypes.string
  }),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  })
};
SaveModal.defaultProps = {
  actions: {},
  auth: { session: '' },
  config: { appLanguage: 'en' },
  editor: {
    text: '',
    showModal: false
  }
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({
    ...counterActions,
    ...registerActions,
    ...libraryActions,
    ...editorActions
  }, dispatch) })
)(SaveModal);
