import React, { Component } from 'react';

class GRPCBodyStream extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let streamNum;
    let streamBody;
    // grabs the query based on the stream id/number
    let streamContent = this.props.newRequestStreams.streamContent[this.props.stream.id];
    // if the none or the first stream query in the array
    if (this.props.stream.id === 1) {
      streamBody = (
        <textarea
          value={`${streamContent ? streamContent : ''}`}
          className={"composer_textarea grpc"}
          id='grpcBodyEntryTextArea'
          type='text'
          placeholder='Type query'
          rows={4}
          onChange={e => this.props.changeHandler(this.props.stream.id, e.target.value)}
        ></textarea>
      )
    } else {
      // if subsequent stream query
      streamBody = (
        <textarea
          value={streamContent}
          className={"composer_textarea grpc"}
          id='grpcBodyEntryTextArea'
          type='text'
          placeholder='Type query'
          rows={4}
          onChange={e => this.props.changeHandler(this.props.stream.id, e.target.value)}
        ></textarea>
      )
    }
    // displays the stream number next to the stream body for client or bidirectionbal streaming
    if (this.props.selectedStreamingType === "CLIENT STREAM" || this.props.selectedStreamingType === "BIDIRECTIONAL") {
      streamNum = (
      <input
        defaultValue={` Stream ${this.props.streamNum + 1}`}
        className='stream-number'        
        type="text"
      ></input>
      )
    }
    const styles = { display: 'flex' };
    /*
    pseudocode for the return section
    - renders the stream body (and the stream number if for client or bidirectional stream)
    */
    return (
    <div style={styles}>
      {streamNum}
      {streamBody}
    </div>
    )
  }
}

export default GRPCBodyStream;
