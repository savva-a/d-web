import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as counterActions from '../redux/counter';
import * as registerActions from '../redux/register';

// import './Component1.scss';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)

class Component2 extends React.Component {
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
        Template ReactJS Component2
        <p className="some">skhfgjks skdjfhgskdhf ksdjhfs d</p>
        <button onClick={this.incr}>INCR</button>
        <button onClick={this.incr5}>INCR 5</button>
      </div>
    );
  }
}

Component2.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  })
};
Component2.defaultProps = {
  actions: {}
};

export default Component2;
