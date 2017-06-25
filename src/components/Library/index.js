import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';
import * as libraryActions from '../../redux/library';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';

import staticImages from '../../staticImages';

import API from '../../client-api';

import './Library.scss';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions, ...libraryActions }, dispatch) })
)

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.libraryClick = this.libraryClick.bind(this);
    this.renderBooksTable = this.renderBooksTable.bind(this);
    this.state = {
      a: 1
    };
  }

  componentDidMount() {
    API.call('book/list', {
      session: '58c79e4e03c0ea4e6e731815'
      // session: this.props.auth.admin.session
    }).then((result) => {
      if (!result.data) console.log('there aren\'t any books, darktime...'); // return this.props.adminsUpload([]);
      console.log(result.data);
      return this.props.actions.loadBooks(result.data);
    });
}

  libraryClick() {
    console.log('1 STATE', this.state); // eslint-disable-line
    // browserHistory.push('/library');
  }

  renderBooksTable(array) {
    // console.log(232323, this.props.library.books);
    return array.map((item, idx) => {
      const res = (
        <tr key={`library-row-${idx}`}>
          <td className="book-title">{item.name}
            <FontAwesome className="pullright icon" name="trash-o" fixedWidth size="2x" onClick={() => { console.log('del this book'); }} />
          </td>
        </tr>);
      return res;
    });
  }

  render() {
    return (
      <div className="component-container">
        <HeaderComponent iconName="book" show />
        <div className="library-page">
          <Table striped hover>
            <tbody>
              {this.renderBooksTable(this.props.library.books)}
            </tbody>
          </Table>
        </div>
        <FooterComponent />
      </div>
    );
  }
}

Library.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  })
};
Library.defaultProps = {
  actions: {}
};

export default Library;
