import React, { Component } from 'react';
import {CookieTableRow} from './CookieTableRow'

class CookieTable extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    let cookieRowArray;
    if (Array.isArray(this.props.cookies)) {
      cookieRowArray = this.props.cookies.map((cookie, i) => {
        return <CookieTableRow className='cookieTableRow' cookie={cookie} key={i} ></CookieTableRow>
      })
    }

    return (
      <div className='cookieTable'>
        <div className='cookieTableHeaders grid-9'>

          <div className='cookieTableHeaderCell'>Name</div>
          <div className='cookieTableHeaderCell'>Value</div>
          <div className='cookieTableHeaderCell'>Domain</div>
          <div className='cookieTableHeaderCell'>HostOnly</div>
          <div className='cookieTableHeaderCell'>Path</div>
          <div className='cookieTableHeaderCell'>Secure</div>
          <div className='cookieTableHeaderCell'>HttpOnly</div>
          <div className='cookieTableHeaderCell'>Session</div>
          <div className='cookieTableHeaderCell'>ExpirationDate</div>
        </div>
        {cookieRowArray}
      </div>
    )
  }
}

export default CookieTable;