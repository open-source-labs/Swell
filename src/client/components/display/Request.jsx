import React, { Component } from 'react';

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
      <div className={'resreq-res-header'}>
        <h1 className={'resreq_title'}>{this.props.content.method} Request</h1>
        {headerArr}
        {/* {this.props.content.body} */}
      </div>
    )
  }
}

export default (Request);