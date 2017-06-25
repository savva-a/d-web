import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as counterActions from '../redux/counter';
import * as registerActions from '../redux/register';

import HeaderComponent from './HeaderComponent';
// import './Component1.scss';

class NotFound extends React.Component {
  constructor(props) {
    super(props);
    this.incr = this.incr.bind(this);
    this.incr5 = this.incr5.bind(this);
    this.state = {
      a: 1
    };
  }

  incr() {
    this.props.actions.increment();
  }

  incr5() {
    this.props.actions.increment(5);
  }

  render() {
    return (
      <div>
        <HeaderComponent />
        NotFound
      </div>
    );
  }
}

NotFound.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  })
};
NotFound.defaultProps = {
  actions: {}
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)(NotFound);
