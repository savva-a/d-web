import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { browserHistory } from 'react-router';

import { Grid, Col, PageHeader } from 'react-bootstrap';


import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';

import HeaderComponent from '../HeaderComponent';
import FooterInfoComponent from '../FooterInfoComponent';

// import words from '../../words';

// import staticImages from '../../staticImages';

import './Faq.scss';

class Faq extends React.Component {

  constructor(props) {
    super(props);
    // this.showLibraryPopover = this.showLibraryPopover.bind(this);
    this.state = {
      a: 1,
    };
  }

  render() {
    // const LN = this.props.config.appLanguage;

    return (
      <div className="component-container">
        <HeaderComponent imgName="infoWhite" show />
        <div className="faq-page" >
          <Grid>
            <Col md={8} mdOffset={2} xs={10} xsOffset={1}>
              {/* <h1>Terms and conditions</h1>*/}
              <PageHeader>Frequently Asked Questions</PageHeader>
              <p className="faq-question">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p className="faq-answer">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p className="faq-question">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p className="faq-answer">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
            </Col>
          </Grid>
        </div>
        <FooterInfoComponent />
      </div>
    );
  }
}

Faq.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  }),
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  })
};
Faq.defaultProps = {
  actions: {},
  config: { appLanguage: 'en' }
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)(Faq);
