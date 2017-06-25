import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import API from '../../client-api';

import Storage from '../../Storage';
import * as actionsAuth from '../../redux/auth';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({
    ...actionsAuth,
  }, dispatch) })
)
export default class SessionService extends React.Component {

  constructor() {
    super();
    this.state = { blank: false };
  }

  componentWillMount() {
    const session = Storage.get('session');
    if (session) {
      this.setState({ blank: true });
      API.call('user/check', {
        session
      }).then((result) => {
        this.props.actions.userAuth(result.data);
        this.setState({ blank: false });
      });
    }
  }

  render() {
    if (this.state.blank && !this.props.auth.session) {
      return <div>Loading ...</div>;
    } else if (this.props.auth.session) {
      return <div>{this.props.children}</div>;
    }
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '30px' }}>
        Please, login
      </div>
    );
  }

}

SessionService.propTypes = {
  actions: React.PropTypes.shape({
    userAuth: React.PropTypes.func,
  }),
  auth: React.PropTypes.shape({
    session: React.PropTypes.string
  }),
  children: React.PropTypes.shape({})
};
SessionService.defaultProps = {
  auth: {
    session: ''
  },
  actions: {},
  children: {}
};
