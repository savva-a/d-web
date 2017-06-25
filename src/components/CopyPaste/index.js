import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';


import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';

import staticImages from '../../staticImages';

import './CopyPaste.scss';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)

class CopyPaste extends React.Component {
  constructor(props) {
    super(props);
    this.libraryClick = this.libraryClick.bind(this);
    this.copyPasteClick = this.copyPasteClick.bind(this);
    this.uploadClick = this.uploadClick.bind(this);
    this.state = {
      a: 1
    };
  }

  libraryClick() {
    console.log('1 STATE', this.state); // eslint-disable-line
    browserHistory.push('/library');
  }

  copyPasteClick() {
    console.log('2 STATE', this.state); // eslint-disable-line
    browserHistory.push('/copyPaste');
  }

  uploadClick() {
    console.log('3 STATE', this.state); // eslint-disable-line
    browserHistory.push('/upload');
  }

  render() {
    return (
      <div className="component-container">
        <HeaderComponent iconName="book" show />
        <div className="copyPaste-page">
          copy Paste
        </div>
        <FooterComponent />
      </div>
    );
  }
}

CopyPaste.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  })
};
CopyPaste.defaultProps = {
  actions: {}
};

export default CopyPaste;
