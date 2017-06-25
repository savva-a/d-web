import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Modal, Image } from 'react-bootstrap';

import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';
import * as libraryActions from '../../redux/library';
import * as editorActions from '../../redux/editor';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';

import staticImages from '../../staticImages';
import words from '../../words';


import API from '../../client-api';

import './Editor.scss';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextEdit = this.handleTextEdit.bind(this);
    this.closeSaveTextModal = this.closeSaveTextModal.bind(this);
    this.handleSaveTextName = this.handleSaveTextName.bind(this);
    this.showModal = this.showModal.bind(this);
    this.saveText = this.saveText.bind(this);
    this.state = {
      fileName: ''
    };
  }

  componentDidMount() {

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
    const regex = /\./;
    const m = regex.exec(this.props.editor.text);
    if (m) {
      this.setState({
        fileName: this.props.editor.text.substr(0, m.index)
      });
    }
  }

  render() {
    const LN = this.props.config.appLanguage;

    return (
      <div className="component-container">
        <HeaderComponent imgName="openBookWhite" show />
        <div className="edit-page">
          <textarea
            className="editor-textarea"
            ref={(c) => { this.editorText = c; }}
            value={this.props.editor.text}
            onChange={this.handleTextEdit}
            style={{ fontSize: this.props.config.textSize, lineHeight: this.props.config.lineSpacing }}
          />
        </div>
        <Modal
          dialogClassName="save-text-modal-dialog"
          show={this.props.editor.showModal}
          onHide={this.closeSaveTextModal}
        >
          <div className="text-save-modal">
            <Image
              circle
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
              defaultValue={this.state.fileName}
              className="text-save-modal__input"
            />
            {/* <img*/}
            <Image
              circle
              src={staticImages.saveIconGreen}
              alt="OK"
              height="48"
              className="text-save-modal__submit"
              onClick={this.saveText}
            />
            <Image
              src={staticImages.doobee3}
              height="40"
              className="text-save-modal__logo"
            />
          </div>
        </Modal>
        <FooterComponent saveText={this.showModal} activeSave />
      </div>
    );
  }
}

Editor.propTypes = {
  actions: React.PropTypes.shape({
    editText: React.PropTypes.func,
    showSaveTextModal: React.PropTypes.func
  }),
  editor: React.PropTypes.shape({
    text: React.PropTypes.string,
    showModal: React.PropTypes.bool
  }),
  config: React.PropTypes.shape({
    textSize: React.PropTypes.string,
    lineSpacing: React.PropTypes.string,
    appLanguage: React.PropTypes.string.isRequred
  }),
  auth: React.PropTypes.shape({
    session: React.PropTypes.string
  })
};
Editor.defaultProps = {
  actions: {},
  config: { appLanguage: 'en' },
  auth: { session: '' },
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
)(Editor);
