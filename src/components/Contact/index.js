import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid } from 'react-bootstrap';


import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import CustomPopover from '../CustomPopover';

import words from '../../words';

import staticImages from '../../staticImages';

import './Contact.scss';

class Contact extends React.Component {

  constructor(props) {
    super(props);
    // this.showLibraryPopover = this.showLibraryPopover.bind(this);
    this.state = {
      a: 1,
    };
  }

  render() {
    const LN = this.props.config.appLanguage;

    return (
      <div className="component-container">
        <HeaderComponent imgName="openBookWhite" show={false} />
        <div className="contact-page" >
          <Grid>
            contact page
          </Grid>
        </div>
        <FooterComponent />
      </div>
    );
  }
}

Contact.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  }),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  })
};
Contact.defaultProps = {
  actions: {},
  config: { appLanguage: 'en' }
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)(Contact)
