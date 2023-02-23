import React, { Component } from 'react';
import ContentReqRowComposer from './ContentReqRowComposer';

class CookieEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.onChangeUpdateCookie = this.onChangeUpdateCookie.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.deleteCookie = this.deleteCookie.bind(this);
  }

  componentDidMount() {
    const cookiesDeepCopy = this.createDeepCookieCopy();
    if (cookiesDeepCopy[cookiesDeepCopy.length - 1]?.key !== '')
      this.addCookie(cookiesDeepCopy);
  }

  componentDidUpdate() {
    const cookiesDeepCopy = this.createDeepCookieCopy();
    if (cookiesDeepCopy.length === 0) {
      this.addCookie([]);
    } else if (cookiesDeepCopy[cookiesDeepCopy.length - 1]?.key !== '') {
      this.addCookie(cookiesDeepCopy);
    }
  }

  createDeepCookieCopy() {
    return JSON.parse(JSON.stringify(this.props.newRequestCookies.cookiesArr));
  }

  addCookie(cookiesDeepCopy) {
    cookiesDeepCopy.push({
      id: `cookie${this.props.newRequestCookies.count}`,
      active: false,
      key: '',
      value: '',
    });

    this.props.newRequestCookiesSet({
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

    this.props.newRequestCookiesSet({
      cookiesArr: cookiesDeepCopy,
      count: cookiesDeepCopy.length,
    });
  }

  deleteCookie = (index) => {
    const newCookies = this.createDeepCookieCopy();
    newCookies.splice(index, 1);
    this.props.newRequestCookiesSet({
      cookiesArr: newCookies,
      count: newCookies.length,
    });
  };

  toggleShow() {
    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    const addCookieName = '+';
    const cookiesArr = this.props.newRequestCookies.cookiesArr.map(
      (cookie, index) => (
        <ContentReqRowComposer
          deleteItem={this.deleteCookie}
          data={cookie}
          type="cookie-row"
          index={index}
          changeHandler={this.onChangeUpdateCookie}
          key={index}
        />
      )
    );

    return (
      <div className="mt-2" style={{ margin: '10px' }}>
        <div className="is-flex is-align-content-center">
          <div className="composer-section-title">Cookies</div>
          <button
            className={`${
              this.props.isDark ? 'is-dark-200' : ''
            } button add-header-gRPC-cookie-button`}
            id="add-cookie"
            onClick={() => this.addCookie(this.createDeepCookieCopy())}
            style={{ height: '3px', width: '3px' }}
          >
            {addCookieName}
          </button>
        </div>
        <div>{cookiesArr}</div>
      </div>
    );
  }
}

export default CookieEntryForm;

// is-justify-content-space-between was removed from + cookie button
