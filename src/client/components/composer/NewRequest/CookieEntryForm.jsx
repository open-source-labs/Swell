import React, { Component } from 'react';
import Header from './Header.jsx';

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
    const cookiesDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestCookies.cookiesArr));
    if (cookiesDeepCopy[cookiesDeepCopy.length-1] && cookiesDeepCopy[cookiesDeepCopy.length-1].key !== "") this.addCookie(cookiesDeepCopy);
  }

  componentDidUpdate() {
    const cookiesDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestCookies.cookiesArr));
    if (this.props.newRequestCookies.cookiesArr.length == 0) {
      this.addCookie([]);
    }
    else if (cookiesDeepCopy[cookiesDeepCopy.length-1] && cookiesDeepCopy[cookiesDeepCopy.length-1].key !== "") {
      this.addCookie(cookiesDeepCopy);
    }
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
    const cookiesDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestCookies.cookiesArr));

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
    const cookiesArr = this.props.newRequestCookies.cookiesArr.map((cookie, index) => {
      return (
        <Header 
          type='cookie' 
          content={cookie} 
          changeHandler={this.onChangeUpdateCookie} 
          key={index} Key={cookie.key} 
          value={cookie.value} />
        )
    });

    const cookiesContainerClass = this.state.show ? 'composer_headers_container-open cookies_container' : 'composer_headers_container-closed cookies_container'

    return (
      <div>
        <label
        title="Add Request Headers"
        className='composer_subtitle' >
        <div className="label-text" id="cookie-click">Cookies</div>
        <div className="toggle">
          <input type="checkbox" name="check" className="toggle-state" onClick={this.toggleShow}/>
          <div className="indicator" />
        </div>
      </label>
        <div className={cookiesContainerClass}>
          {cookiesArr}
        </div>
      </div>
    )
  }
}

export default CookieEntryForm;