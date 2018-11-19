import React, { Component } from 'react';
import 'react-json-pretty/JSONPretty.monikai.styl';
import ReactJson from 'react-json-view'

class ResponsePlain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    const json = this.props.content.events[0].data;
    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ResponsePlain
        {/* <ObjectInspector data={ json } /> */}
        {/* <JSONTree data={json} hideRoot={true} /> */}
        <ReactJson src={json} name={false} collapsed={1} />
        {/* <JSONPretty id="json-pretty" json={JSON.stringify(json)}></JSONPretty> */}
        {/* <div>{JSON.stringify(this.props.content.events[0])}</div> */}
      </div>
    )
  }
}

export default ResponsePlain;