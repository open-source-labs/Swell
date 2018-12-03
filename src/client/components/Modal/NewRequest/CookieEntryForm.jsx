import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions/actions';
const uuidv4 = require('uuid/v4');

const mapStateToProps = store => ({
  newRequestCookies : store.business.newRequestCookies,
  newRequestBody : store.business.newRequestBody,
});

const mapDispatchToProps = dispatch => ({
  setNewRequestCookies : (requestCookiesObj) => {
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
  },
});

class CookieEntryForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeUpdateCookie = this.onChangeUpdateCookie.bind(this);
  }

  componentDidMount () {
    let cookiesDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestCookies.cookiesArr));
    this.addCookie(cookiesDeepCopy);
  }

  componentDidUpdate () {
    if (this.props.newRequestCookies.cookiesArr.length == 0) {
      let cookiesDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestCookies.cookiesArr));
      this.addCookie(cookiesDeepCopy);
    }
  }
  

  addCookie (cookiesDeepCopy) {
    cookiesDeepCopy.push({
      id : this.props.newRequestCookies.count,
      active : false,
      key : '',
      value : ''
    })

    this.props.setNewRequestCookies({
      cookiesArr : cookiesDeepCopy,
      override : false,
      count : cookiesDeepCopy.length,
    });
  }

  onChangeUpdateCookie(id, field, value) {
    let cookiesDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestCookies.cookiesArr));

    //find cookie to update
    let indexToBeUpdated = undefined;
    for(let i = 0; i < cookiesDeepCopy.length; i++) {
      if (cookiesDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }
    //update
    cookiesDeepCopy[indexToBeUpdated][field] = value;

    //also switch checkbox if they are typing
    if(field === 'key' || field === 'value') {
      cookiesDeepCopy[indexToBeUpdated].active = true;
    }
    
    //determine if new cookie needs to be added
    let emptyCookiesCount = cookiesDeepCopy.map(cookie => {
      return (!cookie.key && !cookie.value) ? 1 : 0
    }).reduce((acc, cur) => {
      return acc + cur;
    });

    //depending on if cookies is empty, update store, or first add a new cookie
    if (emptyCookiesCount === 0) {
      this.addCookie(cookiesDeepCopy);
    } 
    else {
      this.props.setNewRequestCookies({
        cookiesArr : cookiesDeepCopy,
        count : cookiesDeepCopy.length,
      });
    }
  }

  render() {
    // console.log('CookieEntryForm Begin Render', this.state.cookies);
    let cookiesArr = this.props.newRequestCookies.cookiesArr.map((cookie, index) => {
      return (<Cookie content={cookie} changeHandler={this.onChangeUpdateCookie} key={index} Key={cookie.key} value={cookie.value}></Cookie>)
    });
    
    return(
      <div style={this.props.stylesObj}>
        {cookiesArr}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CookieEntryForm);