import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class Nav extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
      <div>
        NavContainer
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);