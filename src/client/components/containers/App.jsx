import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../assets/style/App.scss'
import * as actions from '../../actions/actions';
import NavContainer from './NavContainer.jsx';
import ContentsContainer from './ContentsContainer.jsx';
import ModalContainer from '../Modal/ModalContainer.jsx';

const mapStateToProps = store => ({
  store: store,
});

const mapDispatchToProps = dispatch => ({

});

class App extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.store);
  }

  render() {
    return(
      <div id='app'>
        {/* App */}
        <NavContainer/>
        <ContentsContainer/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);