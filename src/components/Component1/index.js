import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import FA from 'react-fontawesome';
import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';

import './Component1.scss';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';

const FontAwesome = require('react-fontawesome');


class Component1 extends React.Component {
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
      <div className="component1">
        <HeaderComponent imgName="openBookWhite" show />
        <div style={{ margin: 'auto 0' }}>
          Template ReactJS Component1
          <p className="some">component 1</p>
          <button onClick={this.incr}>INCR</button>
          <FontAwesome name="twitter" spin />
          <button onClick={this.incr5}>INCR 5</button>
        </div>
        <FooterComponent />
      </div>
    );
  }
}

Component1.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  })
};
Component1.defaultProps = {
  actions: {}
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)(Component1);
