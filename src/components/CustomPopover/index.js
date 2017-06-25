import React from 'react';

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
          padding: 10,
          fontFamily: 'Arial',
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
};
CustomPopover.defaultProps = {
  style: {},
  text: ''
};

export default CustomPopover;
