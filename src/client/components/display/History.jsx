import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions/actions';
import dbController from '../../controllers/dbController';

const mapStateToProps = store => ({
});

const mapDispatchToProps = dispatch => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  },
  reqResDelete: (reqRes) => {
    dispatch(actions.reqResDelete(reqRes));
  },
  deleteFromHistory: (reqRes) => {
    dispatch(actions.deleteFromHistory(reqRes))
  },
  setNewRequestFields : (requestObj) => {
    dispatch(actions.setNewRequestFields(requestObj));
  }
})

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleClick = this.handleClick.bind(this); 
    this.deleteHistory = this.deleteHistory.bind(this);
  }

  handleClick () {
    console.log('clicked', this.props.content);
    const requestObj = {
      method : this.props.content.request.method ? this.props.content.request.method : 'GET',
      protocol : this.props.content.protocol ? this.props.content.protocol : 'http://',
      headers : this.props.content.request.headers ? this.props.content.request.headers : [],
      body : this.props.content.request.body ? this.props.content.request.body : {},
      url : this.props.content.host ? this.props.content.host : 'http://',
      JSONFormatted : this.props.content.request.JSONFormatted ? this.props.content.request.JSONFormatted : false,
      bodyType: 'none',
      rawType: 'Text (text/plain)',
      override: true
    }
    console.log(requestObj);
    console.log(this.props.content);
    this.props.setNewRequestFields(requestObj);
  }

  deleteHistory (e) {
    console.log('deleting from history', e.target);
    this.props.deleteFromHistory(this.props.content);
    dbController.deleteFromHistory(e.target.id);
  }


  render() {

    return(
      <div className={'history'}>
        <span className={'history-text'} onClick={this.handleClick}>
          <span className={'history-method'}>{this.props.content.request.method} - </span>
          <span className={'history-url'}>{this.props.content.url} - </span>
        </span>
        <span className={'history-btns'}>
          <button className={"history-add-btn"} onClick={this.handleClick}>+</button> - 
          <button id={this.props.content.id} className={'history-delete-btn'} onClick={this.deleteHistory}>X</button>
        </span>   
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History);