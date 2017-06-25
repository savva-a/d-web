import React from 'react';
// import React, { createClass } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import staticImages from '../../staticImages';


class ColoredScrollbars extends React.Component {

  static renderThumb() {
    return (
      <img alt="scrollThumb" src={staticImages.blackball} width="30" />
    );
  }


  constructor(props) {
    super(props);
    this.renderTrack = this.renderTrack.bind(this);
    this.state = {
      scrollHeight: 0,
      clientHeight: 1
    };
  }

  renderTrack() {
    if (this.scrollbars && this.scrollbars.getScrollHeight()) {
      // const scrollHeight = this.scrollbars.getScrollHeight();
      // const clientHeight = this.scrollbars.getClientHeight();
      // if (scrollHeight > clientHeight) {
      // if (true) {
      return (
        <div
          style={{
            position: 'absolute',
            width: '30px',
            right: '0px',
            bottom: '0px',
            top: '0px',
            backgroundColor: '#BBBBBB',
          }}
        />
      );
      // }
    }
    return (<div
      style={{
        position: 'absolute',
        width: '30px',
        right: '0px',
        bottom: '0px',
        top: '0px',
        backgroundColor: '#BBBBBB',
      }}
    />);
  }

  render() {
    return (
      <Scrollbars
        ref={(c) => { this.scrollbars = c; }}
        thumbSize={30}
        renderThumbVertical={ColoredScrollbars.renderThumb}
        renderTrackVertical={this.renderTrack}
        {...this.props}
      />
    );
  }
}

export default ColoredScrollbars;
