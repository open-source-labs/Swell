import React, { Component } from 'react';


class CookieTableCell extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        console.log('bottom cookie table', this.props.detail)
        return (
          <div className='cookieTableCell'>
            {this.props.detail.toString()}
          </div>
        )
    }
}

export default CookieTableCell;