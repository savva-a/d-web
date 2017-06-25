import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { Link } from 'react-router';
// import FA from 'react-fontawesome';
import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';

import staticImages from '../../staticImages';
import './HeaderComponent.scss';

const FontAwesome = require('react-fontawesome');

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)

class HeaderComponent extends React.Component {

  static back() {
    window.history.back();
    // console.log('back');
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
          <span // eslint-disable-line jsx-a11y/no-static-element-interactions
            onClick={HeaderComponent.back}
          >
            <FontAwesome name="undo" size="lg" />
          </span>
          {this.props.imgName ?
            <span className="center-icon">
              <img alt={this.props.imgName} src={staticImages[this.props.imgName]} height="30" />
            </span>
          : null}

          <span style={{ width: '62.5px' }} />

        </div>
      : null
    );
  }
}

HeaderComponent.propTypes = {
  show: React.PropTypes.bool,
  imgName: React.PropTypes.string,
};
HeaderComponent.defaultProps = {
  show: false,
  imgName: undefined,
};

export default HeaderComponent;
