import React, { Component } from 'react';
import ContentReqRowComposer from './ContentReqRowComposer.jsx';

class CookieEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    }
    this.onChangeUpdateCookie = this.onChangeUpdateCookie.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
  }

  componentDidMount() {
    const cookiesDeepCopy = this.createDeepCookieCopy();
    if (cookiesDeepCopy[cookiesDeepCopy.length-1] && cookiesDeepCopy[cookiesDeepCopy.length-1].key !== "") this.addCookie(cookiesDeepCopy);
  }

  componentDidUpdate() {
    const cookiesDeepCopy = this.createDeepCookieCopy();
    if (this.props.newRequestCookies.cookiesArr.length == 0) {
      this.addCookie([]);
    }
    else if (cookiesDeepCopy[cookiesDeepCopy.length-1] && cookiesDeepCopy[cookiesDeepCopy.length-1].key !== "") {
      this.addCookie(cookiesDeepCopy);
    }
  }

  createDeepCookieCopy () {
    return JSON.parse(JSON.stringify(this.props.newRequestCookies.cookiesArr));
  }

  addCookie(cookiesDeepCopy) {
    cookiesDeepCopy.push({
      id: this.props.newRequestCookies.count,
      active: false,
      key: '',
      value: ''
    })

    this.props.setNewRequestCookies({
      cookiesArr: cookiesDeepCopy,
      override: false,
      count: cookiesDeepCopy.length,
    });
  }

  onChangeUpdateCookie(id, field, value) {
    const cookiesDeepCopy = this.createDeepCookieCopy();

    //find cookie to update
    let indexToBeUpdated;
    for (let i = 0; i < cookiesDeepCopy.length; i++) {
      if (cookiesDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }
    //update
    cookiesDeepCopy[indexToBeUpdated][field] = value;

    //also switch checkbox if they are typing
    if (field === 'key' || field === 'value') {
      cookiesDeepCopy[indexToBeUpdated].active = true;
    }

    //determine if new cookie needs to be added
    const emptyCookiesCount = cookiesDeepCopy.map(cookie => {
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
        cookiesArr: cookiesDeepCopy,
        count: cookiesDeepCopy.length,
      });
    }
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  render() {
    const cookiesArr = this.props.newRequestCookies.cookiesArr.map((cookie, index) => (
      <ContentReqRowComposer 
        data={cookie} 
        changeHandler={this.onChangeUpdateCookie} 
        key={index}
      />
    ));

    return (
      <div >
        <div className='is-flex is-justify-content-space-between is-align-content-center'>
          Cookies
          <button 
            className="button is-small add-header-or-cookie-button"
            onClick={() => this.addCookie(this.createDeepCookieCopy())}> 
            + Cookie
          </button>
        </div>
        <div>
          {cookiesArr}
        </div>
      </div>
    );
  }
}

export default CookieEntryForm;