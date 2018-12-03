import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions/actions';
import Header from './Header.jsx';
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
    this.state = {
      show : false,
    }
    this.onChangeUpdateCookie = this.onChangeUpdateCookie.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
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

  toggleShow () {
    this.setState ({
      show : !this.state.show
    });
  }

  render() {
    // console.log('CookieEntryForm Begin Render', this.state.cookies);
    console.log('Cookie props', this.props);
    let cookiesArr = this.props.newRequestCookies.cookiesArr.map((cookie, index) => {
      return (<Header content={cookie} changeHandler={this.onChangeUpdateCookie} key={index} Key={cookie.key} value={cookie.value}></Header>)
    });

    const arrowClass = this.state.show ? 'modal_subtitle_arrow-open' : 'modal_subtitle_arrow-closed';
    const cookiesContainerClass = this.state.show ? 'modal_headers_container-open' : 'modal_headers_container-closed'
    
    return(
      <div>
        <div className='modal_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
          <img className={arrowClass} style={{'marginTop' : '-6px'}} src='https://www.materialui.co/materialIcons/navigation/arrow_drop_down_white_192x192.png'>
          </img>
          Cookies
        </div>
        <div className={cookiesContainerClass}>
          {cookiesArr}
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CookieEntryForm);