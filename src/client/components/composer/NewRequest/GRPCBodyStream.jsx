import React, { Component } from 'react';

class GRPCBodyStream extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let bodyType;
    let streamBody;
    // console.log('this.props.newRequestStreams.count: ', this.props.newRequestStreams.count)
    // let count = this.props.newRequestStreams.count - 1;
    // console.log('this.props.stream: ', this.props.stream)
    // console.log('this.props.stream.id: ', this.props.stream.id)
    let streamContent = this.props.newRequestStreams.streamContent[this.props.stream.id];
    // let textareaID = `grpcBodyEntryTextArea${count}`;
    if (this.props.stream.id === 1) {
      streamBody = (
        <textarea
          value={`${streamContent ? streamContent : ''}`}
          className={"composer_textarea grpc"}
          id='grpcBodyEntryTextArea'
          // style={{ 'resize': 'none' }} 
          type='text'
          placeholder='Type query'
          rows={4}
          onChange={e => this.props.changeHandler(this.props.stream.id, e.target.value)}
          // onChange={e => this.props.changeHandler(textareaID, e.target.value)}
        ></textarea>
      )
    } else {
      // let textareaID = `grpcBodyEntryTextArea_${count}`;
      streamBody = (
        <textarea
          value={streamContent}
          className={"composer_textarea grpc"}
          id='grpcBodyEntryTextArea'
          // style={{ 'resize': 'none' }} 
          type='text'
          placeholder='Type query'
          rows={4}
          // onChange={e => this.props.changeHandler(this.props.stream.id, e.target.value)}
          onChange={e => this.props.changeHandler(this.props.stream.id, e.target.value)}
        ></textarea>
      )
    }
    if (this.props.selectedStreamingType === "CLIENT STREAM" || this.props.selectedStreamingType === "BIDIRECTIONAL") {
      bodyType = (
      <input
        defaultValue={` Stream ${this.props.streamNum + 1}`}
        className='stream-number'
        // style={{ 'resize': 'none' }} 
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

