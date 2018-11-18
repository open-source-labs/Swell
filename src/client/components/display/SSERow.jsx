import React, { Component } from 'react';
import { connect } from 'react-redux';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/JSONPretty.monikai.styl';
import ReactJson from 'react-json-view'
import JSONTree from 'react-json-tree'
import ObjectInspector from 'react-object-inspector';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class SSERow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props.content)
    const json = this.props.content.data;
    console.log(json);
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
            {/* <ObjectInspector data={ json } /> */}
            {/* <JSONTree data={json} hideRoot={true} /> */}
            <ReactJson src={{json}} name={false} displayDataTypes={false} />
            {/* <JSONPretty id="json-pretty" json={JSON.stringify(this.props.content.data)}></JSONPretty> */}
            {/* <div>{JSON.stringify(this.props.content.data)}</div> */}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SSERow);