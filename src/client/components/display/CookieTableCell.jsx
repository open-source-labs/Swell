import React, { Component } from 'react';


class CookieTableCell extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        return (
          <div className='cookieTableCell'>
            {this.props.detail}
          </div>
        )
    }
}

export default CookieTableCell;