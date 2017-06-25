import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import braintree from 'braintree-web';

import * as counterActions from '../redux/counter';
import * as registerActions from '../redux/register';

import API from '../client-api';


// import './Component1.scss';



class Component2 extends React.Component {
  constructor(props) {
    super(props);
    this.incr = this.incr.bind(this);
    this.incr5 = this.incr5.bind(this);
    this.state = {
      a: 1
    };
  }

  componentDidMount() {
    // const submitButton = document.querySelector('#submit-button');
    // const submitButton = this.submitBtn;

    API.call('checkout/getClientToken', {})
    .then((res) => {
      console.log(777, res.data.clientToken);

      // braintree.dropin.create({
      //   authorization: res.data.clientToken, // 'CLIENT_AUTHORIZATION',
      //   selector: '#dropin-container'
      // }, function (err, dropinInstance) {
      //   console.log('lsdjhfg 777777', dropinInstance);
      //   submitButton.addEventListener('click', function () {
      //     dropinInstance.requestPaymentMethod(function (err, payload) {
      //       if (err) {
      //         // Handle errors in requesting payment method
      //         // This includes invalid card form or no payment method available
      //         // Errors relevant to customers will be show in the UI as well
      //
      //         return;
      //       }
      //       console.log('payload', payload);
      //       console.log('Send payload.nonce to your server');
      //       // Send payload.nonce to your server
      //     });
      //   });
      // });
    });
  }

  incr() {
    this.props.actions.increment();
  }

  incr5() {
    this.props.actions.increment(5);
  }

  render() {
    return (
      <div>
        Template ReactJS Component2
        <p className="some">skhfgjks skdjfhgskdhf ksdjhfs d</p>
        <button onClick={this.incr}>INCR</button>
        <button onClick={this.incr5}>INCR 5</button>
        <form>
          <div id="dropin-container"></div>
        </form>
        <button
          ref={(c) => { this.submitBtn = c; }}
          id="submit-button"
        >
          submit-button
        </button>
      </div>
    );
  }
}

Component2.propTypes = {
  actions: React.PropTypes.shape({
    increment: React.PropTypes.func,
    addRegisterData: React.PropTypes.func
  })
};
Component2.defaultProps = {
  actions: {}
};

export default connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({ ...counterActions, ...registerActions }, dispatch) })
)(Component2);
