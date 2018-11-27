import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view'

class SSERow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let contentBody;
    try {
      let json = JSON.parse(this.props.content.data);
      contentBody = <ReactJson src={json} name={false} displayDataTypes={false} />
    } catch (err) {
      contentBody = this.props.content.data;
    }

    return(
      <div className={'response_sse'}>
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
            {contentBody}
          </div>
        </div>
      </div>
    )
  }
}

export default SSERow;