import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'react-json-pretty/JSONPretty.monikai.styl';
import ReactJson from 'react-json-view'

class SSERow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const json = this.props.content.data;

    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        SSERow
        <div style={{'display' : 'flex', 'flexDirection' : 'column'}}>
          <div style={{'display' : 'flex'}}>
            <div style={{'width' : '33%'}}>
              <div style={{'width' : '50%'}}>ID</div>
              <div style={{'width' : '50%'}}>{this.props.content.id}</div>
            </div>
            <div style={{'width' : '33%'}}>
              <div style={{'width' : '50%'}}>Event</div>
              <div style={{'width' : '50%'}}>{this.props.content.event}</div>
            </div>
            <div style={{'width' : '33%'}}>
              <div style={{'width' : '50%'}}>Time Received</div>
              <div style={{'width' : '50%'}}>{this.props.content.timeReceived}</div>
            </div>
          </div>
          <div>
            Data
            <ReactJson src={{json}} name={false} displayDataTypes={false} />
          </div>
        </div>
      </div>
    )
  }
}

export default SSERow;