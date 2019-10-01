import React, { Component } from 'react';
import CookieTableCell from './CookieTableCell.jsx'


class CookieTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    let tableCellArray = [];
    for (const key in this.props.cookie) {
      tableCellArray.push(<CookieTableCell detail={this.props.cookie[key]} key={key}></CookieTableCell>)
    }
    if (!this.props.cookie.expirationDate) {
      tableCellArray.push(<CookieTableCell detail={''} key='expirationDate'></CookieTableCell>)
    }
    // else {
    //     tableCellArray.push(<CookieTableCell detail={this.props.cookie.expirationDate} key='expirationDate'></CookieTableCell>)
    // }
    // console.log('tableCellArray', tableCellArray);
    return (
      <div className='cookieTableRow grid-9'>
        {tableCellArray}
      </div>
    )
  }
}

export default CookieTableRow;