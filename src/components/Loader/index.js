import React from 'react';

import './Loader.scss';

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    if (this.props.show) {
      return (
        <div id="floatingCirclesG" style={this.props.style} >
          <div className="f_circleG" id="frotateG_01" />
          <div className="f_circleG" id="frotateG_02" />
          <div className="f_circleG" id="frotateG_03" />
          <div className="f_circleG" id="frotateG_04" />
          <div className="f_circleG" id="frotateG_05" />
          <div className="f_circleG" id="frotateG_06" />
          <div className="f_circleG" id="frotateG_07" />
          <div className="f_circleG" id="frotateG_08" />
        </div>
      );
    }
    return null;
  }
}

Loader.propTypes = {
  show: React.PropTypes.bool,
  style: React.PropTypes.shape({}),
};
Loader.defaultProps = {
  show: false,
  style: {}
};

export default Loader;
