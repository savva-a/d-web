import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { browserHistory } from 'react-router';

import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';
import * as libraryActions from '../../redux/library';
import * as bookViewerActions from '../../redux/bookViewer';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import ColoredScrollbars from '../ColoredScrollBar';
import Loader from '../Loader';

// import staticImages from '../../staticImages';

import API from '../../client-api';

import './Library.scss';

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.renderBooksTable = this.renderBooksTable.bind(this);
    this.delBook = this.delBook.bind(this);
    this.bookView = this.bookView.bind(this);
    this.state = {
      showLoader: false
    };
  }

  componentDidMount() {
    API.call('book/list', {
      session: this.props.auth.session
    }).then((r) => {
      const result = r;
      // if (!result.data) console.log('there aren\'t any books, darktime...');
      // return this.props.adminsUpload([]);
      if (result.data.msg === 'Not found') result.data = [];
      return this.props.actions.loadBooks(result.data);
    });
  }

  delBook(id) {
    this.setState({
      showLoader: true
    });
    API.call('book/delete', {
      session: this.props.auth.session,
      book: id
    }).then(() => {
      // if (!result.data) console.log('there aren\'t any books, darktime...');
      this.setState({
        showLoader: false
      });
      const books = this.props.library.books;
      const idx = books.findIndex(item => item._id === id);
      if (idx >= 0) books.splice(idx, 1);

      return this.props.actions.loadBooks(books);
    });
  }

  bookView(id) {
    this.setState({
      showLoader: true
    });
    API.call('book/view', {
      session: this.props.auth.session,
      book: id
    })
    .then((result) => {
      this.setState({
        showLoader: false
      });
      this.props.actions.getBook(result.data.book);
      browserHistory.push('/viewer');
    });
  }

  renderBooksTable(array) {
    return array.map((item) => {
      const res = (
        <tr key={`library-row-${item._id}`}>
          <td className="book-title">
            <span className="pointer" onDoubleClick={() => { this.bookView(item._id); }}>
              {item.name}
            </span>
            <FontAwesome
              className="pullright icon"
              name="trash-o"
              fixedWidth
              size="2x"
              onClick={() => { this.delBook(item._id); }}
            />
          </td>
        </tr>);
      return res;
    });
  }

  render() {
    return (
      <div className="component-container">
        <HeaderComponent imgName="openBookWhite" show />
        <ColoredScrollbars className="library-page">
          <Loader show={this.state.showLoader} />
          <Table striped hover>
            <tbody>
              {this.renderBooksTable(this.props.library.books)}
            </tbody>
          </Table>
        </ColoredScrollbars>
        <FooterComponent />
      </div>
    );
  }
}

Library.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    getBook: React.PropTypes.func,
    loadBooks: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  }),
  library: React.PropTypes.shape({
    books: React.PropTypes.array
  })
};
Library.defaultProps = {
  actions: {},
  library: {
    books: []
  }
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({
    ...counterActions,
    ...registerActions,
    ...bookViewerActions,
    ...libraryActions
  }, dispatch) })
)(Library);
