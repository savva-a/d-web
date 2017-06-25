import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

// import { Button, Row, Col, Jumbotron } from 'react-bootstrap';

import FileReaderInput from '../../libs/react-file-reader-input';

import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import Loader from '../Loader';

import words from '../../words';

import API from '../../client-api';

import './Upload.scss';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.upload = this.upload.bind(this);
    this.onLoadFile = this.onLoadFile.bind(this);
    this.handleURLinput = this.handleURLinput.bind(this);
    this.state = {
      readyToLoadFile: false,
      showLoader: false
    };
  }

  onLoadFile(e, results) {
    if (results.length) {
      const file = results[0][1];
      this.setState({ file, readyToLoadFile: !!file });
      this.input.value = file.name;
      this.input.disabled = true;
    } else {
      this.setState({ file: null, readyToLoadFile: false });
      this.input.value = '';
      this.input.disabled = false;
    }
  }

  upload() {
    const data = new FormData();
    if (this.state.file) {
      data.append('file', this.state.file);
    }
    if (this.state.url) {
      data.append('url', this.state.url);
    }
    data.append('session', this.props.auth.session);
    this.setState({
      showLoader: true
    });
    fetch(`${API.config.host}/book/upload`, {
      method: 'POST',
      body: data
    })
    .then((response) => {
      this.setState({
        showLoader: false
      });
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }
      return Promise.reject(new Error(response.statusText));
    })
    // .then((response => response.json()))
    .then(() => { browserHistory.push('/library'); })
    // .then((response) => { console.log('response: ', response.data.book); return response; })
    .catch(error => console.log('Error', error)); // eslint-disable-line no-console
  }

  handleURLinput(e) {
    this.setState({ url: e.target.value, readyToLoadFile: e.target.value.length });
  }


  render() {
    const LN = this.props.config.appLanguage;

    return (
      <div className="component-container upload-background">
        <HeaderComponent imgName="uploadWhite" show />
        <Loader show={this.state.showLoader} />
        <div className="upload-subheader">
          <span className="upload-subheader-text">
            {words.uploadSubHeader[LN]}
          </span>
        </div>
        <div className="upload-page">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="upload-white-blank">
              <FileReaderInput
                as="binary" id="my-file-input"
                onChange={this.onLoadFile}
              >
                <div className="FileInput-container">
                  <button>{words.uploadBrowse[LN]}</button>
                </div>
              </FileReaderInput>
              <input
                placeholder={words.uploadPlaceholder[LN]}
                className="FileInput-text"
                onChange={this.handleURLinput}
                ref={(c) => { this.input = c; }}
              />
            </div>
            <div style={{ color: '#96a093', paddingTop: '10px' }}>
              {words.SupportedFileTypes[LN]}
            </div>
          </div>

          <button
            onClick={this.upload}
            disabled={!this.state.readyToLoadFile}
            className={`upload-btn ${this.state.readyToLoadFile ? '' : 'upload-btn-disabled'}`}
          >{words.uploadFile[LN]}</button>
        </div>
        <FooterComponent />
      </div>
    );
  }
}

Upload.propTypes = {
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  })
};
Upload.defaultProps = {
  config: { appLanguage: 'en' }
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)(Upload);
