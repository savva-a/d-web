import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Link } from 'react-router';
// import FA from 'react-fontawesome';
import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';

import './HeaderComponent.scss';

const FontAwesome = require('react-fontawesome');

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)

class HeaderComponent extends React.Component {

  static back() {
    window.history.back();
    console.log('back');
  }

  constructor(props) {
    super(props);
    // this.incr = this.incr.bind(this);
    this.state = {
      a: 1
    };
  }

  render() {
    return (
      this.props.show ?
      <div className="sec-nav">

        <span onClick={HeaderComponent.back}>
          <FontAwesome name="undo" size="lg" />
          back
        </span>

        {this.props.iconName ?
          <span onClick={HeaderComponent.back} className="center-icon">
            <FontAwesome name={this.props.iconName} size="lg" />
          </span>
          : null
        }
        <span style={{ width: '62.5px' }}></span>

      </div>
      : null
    );
  }
}

HeaderComponent.propTypes = {
  show: React.PropTypes.bool,
  iconName: React.PropTypes.string,
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  })
};
HeaderComponent.defaultProps = {
  actions: {},
  show: false,
  iconName: undefined
};

export default HeaderComponent;
