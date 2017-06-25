import React from 'react';

import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import { OverlayTrigger, Image } from 'react-bootstrap';


// import * as counterActions from '../../redux/counter';
// import * as registerActions from '../../redux/register';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import CustomPopover from '../CustomPopover';

import words from '../../words';

import staticImages from '../../staticImages';

import './HomePage.scss';

@connect(
  state => ({ ...state }),
  // dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)

class HomePage extends React.Component {

  static libraryClick() {
    browserHistory.push('/library');
  }

  static copyPasteClick() {
    browserHistory.push('/copyPaste');
  }

  static uploadClick() {
    browserHistory.push('/upload');
  }

  constructor(props) {
    super(props);
    this.showLibraryPopover = this.showLibraryPopover.bind(this);
    this.hideLibraryPopover = this.hideLibraryPopover.bind(this);
    this.showUploadPopover = this.showUploadPopover.bind(this);
    this.hideUploadPopover = this.hideUploadPopover.bind(this);
    this.showCopyPastePopover = this.showCopyPastePopover.bind(this);
    this.hideCopyPastePopover = this.hideCopyPastePopover.bind(this);
    this.state = {
      a: 1,
      showLibraryPopover: false,
      showUploadPopover: false,
      showCopyPastePopover: false
    };
  }

  showLibraryPopover() {
    this.setState({ showLibraryPopover: true });
  }
  hideLibraryPopover() {
    this.setState({ showLibraryPopover: false });
  }


  showUploadPopover() {
    this.setState({ showUploadPopover: true });
  }
  hideUploadPopover() {
    this.setState({ showUploadPopover: false });
  }


  showCopyPastePopover() {
    this.setState({ showCopyPastePopover: true });
  }
  hideCopyPastePopover() {
    this.setState({ showCopyPastePopover: false });
  }


  render() {
    const LN = this.props.config.appLanguage;

    const libraryPopover = (
      <CustomPopover text={words.libraryPopover[LN]} />
    );
    const copyPastePopover = (
      <CustomPopover text={words.copyPastePopover[LN]} />
    );
    const uploadPopover = (
      <CustomPopover text={words.uploadPopover[LN]} />
    );
    return (
      <div className="component-container grey-page">
        <HeaderComponent imgName="openBookWhite" show={false} />
        <div className="home-page" >
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={libraryPopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={staticImages.library}
              height="175"
              alt="library"
              onClick={HomePage.libraryClick}
              className="central-img"
            />
          </OverlayTrigger>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={copyPastePopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={staticImages.copyPaste}
              height="175"
              alt="copyPaste"
              onClick={HomePage.copyPasteClick}
              className="central-img"
            />
          </OverlayTrigger>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={uploadPopover}
            delayShow={0}
            delayHide={0}
          >
            <Image
              src={staticImages.upload}
              height="175"
              alt="upload"
              onClick={HomePage.uploadClick}
              className="central-img"
            />
          </OverlayTrigger>
        </div>
        <FooterComponent inactive />
      </div>
    );
  }
}

HomePage.propTypes = {
  config: React.PropTypes.shape({
    appLanguage: React.PropTypes.string.isRequred
  })
};
HomePage.defaultProps = {
  config: { appLanguage: 'en' }
};

export default HomePage;
