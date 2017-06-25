import React from 'react';

// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

// import FontAwesome from 'react-fontawesome';

// import * as counterActions from '../../redux/counter';

// import './FooterComponent.scss';

// @connect(
//   state => ({ ...state }),
//   dispatch => ({ actions: bindActionCreators({ ...counterActions }, dispatch) })
// )

class CustomPopover extends React.Component {
  constructor(props) {
    super(props);
    // this.libraryClick = this.libraryClick.bind(this);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          backgroundColor: '#EEE',
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
          border: '1px solid #CCC',
          borderRadius: 3,
          // marginLeft: -5,
          // marginTop: 5,
          padding: 10,
          ...this.props.style
        }}
      >
        {this.props.text}
      </div>
    );
  }
}

CustomPopover.propTypes = {
  style: React.PropTypes.shape({}),
  text: React.PropTypes.string
  // actions: React.PropTypes.shape({
  //   increment: React.PropTypes.func
  // })
};
CustomPopover.defaultProps = {
  style: {},
  text: ''
  // active: true,
  // actions: {}
};

export default CustomPopover;
