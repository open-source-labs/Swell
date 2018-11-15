import React, { Component } from 'react';
import { connect } from 'react-redux';

class ToggleBtn extends Component {
    constructor(props) {
      super(props);
      this.state = {
          isToggled: true
        };
        this.handleClick = this.handleClick.bind(this);
    }
  

      handleClick() {
      	this.setState(prevState => ({
            isToggled: !prevState.isToggled
      	}));
      }
  
    render() {
      return (
        <button onClick={this.handleClick}>
          {this.state.isToggled ? 'OPEN CONNECTION' : 'CLOSE CONNECTION'}
        </button>
      );
    }
  }
  
export default ToggleBtn;