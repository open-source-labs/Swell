import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import NavContainer from './NavContainer.jsx';
import ContentsContainer from './ContentsContainer.jsx';
import ModalContainer from './ModalContainer.jsx';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class App extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
      <div id='app'>
        App
        <NavContainer/>
        <ContentsContainer/>
        <ModalContainer/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);