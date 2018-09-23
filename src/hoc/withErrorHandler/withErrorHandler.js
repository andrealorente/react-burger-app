import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = ( WrappedComponent, axios ) => {
  /** Anonymous class */
  return class extends Component {
    state = {
      error: null
    }

    /** Setup config before all the child components are rendered
     * To be available for the BurgerBuilder renderer. It's not 
     * causing side effects because it's only configuration.
     */
    componentWillMount () {
      this.reqInterceptor = axios.interceptors.request.use( req => {
        this.setState({error: null});
        return req;
      });

      this.resInterceptor = axios.interceptors.response.use(res => res, error => {
        this.setState({
          error: error
        });
      });
    }

    /** Lifecycle hook called when a component isn't required anymore. */
    componentWillUnmount () {
      console.log('Will Unmount', this.reqInterceptor, this.resInterceptor);
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    modalClickHandler = () => {
      this.setState({
        error: null
      });
    }

    render () {
      return (
        <Aux>
          <Modal show={this.state.error} clickBackdrop={this.modalClickHandler}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  }
}

export default withErrorHandler;