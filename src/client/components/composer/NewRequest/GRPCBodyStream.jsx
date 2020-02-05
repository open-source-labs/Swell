import React, { Component } from 'react';

class GRPCBodyStream extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let bodyType;
    let streamBody;
    // grab query
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
    // number the query stream after add
    if (this.props.selectedStreamingType === "CLIENT STREAM" || this.props.selectedStreamingType === "BIDIRECTIONAL") {
      bodyType = (
      <input
        defaultValue={` Stream ${this.props.streamNum + 1}`}
        className='stream-number'        
        type="text"
      ></input>
      )
    }
    const styles = { display: 'flex' };
    return (
    <div style={styles}>
      {bodyType}
      {streamBody}
    </div>
    )
  }
}

export default GRPCBodyStream;
