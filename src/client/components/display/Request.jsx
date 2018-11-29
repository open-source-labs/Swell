import React, { Component } from 'react';
import Tab from './Tab.jsx';
import RequestTabs from './RequestTabs.jsx';


class Request extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    let headerArr = this.props.content.headers.map((header, index) => {
      return (<div key={index} style={{'display' : 'flex'}}>
        <div style={{'width' : '50%'}}>{header.key}</div>
        <div style={{'width' : '50%'}}>{header.value}</div>
      </div>)
    })

    return(
      <div className={'res_header'}>
        <span className={'title_offset tertiary-title'}>{this.props.content.method} Request</span>
        {/* {headerArr} */}
        <RequestTabs />
        {/* {this.props.content.body} */}
      </div>
    )
  }
}

export default (Request);