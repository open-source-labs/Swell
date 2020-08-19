/* eslint-disable lines-between-class-members */
import React, { Component } from 'react';

class GRPCBodyStream extends Component {
  constructor(props) {
    super(props);
    // need to bind the 'this' of the event handler to the component instance when it is being rendered
    this.deleteStream = this.deleteStream.bind(this);
  }
  // event handler that allows the client to delete a stream body
  // eslint-disable-next-line lines-between-class-members
  deleteStream(id) {
    const streamsArr = this.props.newRequestStreams.streamsArr;
    const streamContent = this.props.newRequestStreams.streamContent;
    // delete the query from the streamContent arr and the stream body from streamsArr
    streamContent.splice(id, 1);
    streamsArr.splice(id, 1);
    // reassign the id num of each subsequent stream body in the streamsArr after the deletion
    for (let i = id; i < streamsArr.length; i++) {
      streamsArr[i].id = i;
    }
    // update the state in the store
    this.props.setNewRequestStreams({
      ...this.props.newRequestStreams,
      streamsArr,
      count: streamsArr.length,
      streamContent
    });
  }
  render() {
    let streamNum;
    let streamBody;
    let deleteStreamBtn;
    // grabs the query based on the stream id/number
    const streamContent = this.props.newRequestStreams.streamContent[this.props.stream.id];
    // if none or the first stream query in the array
    if (this.props.stream.id === 1) {
      streamBody = (
        <textarea
          value={`${streamContent || ''}`}
          className="composer_textarea grpc"
          id='grpcBodyEntryTextArea'
          type='text'
          placeholder='Type query'
          rows={4}
          onChange={e => this.props.changeHandler(this.props.stream.id, e.target.value)}
         />
      )
    } else {
      // for subsequent stream query
      streamBody = (
        <textarea
          value={streamContent}
          className="composer_textarea grpc"
          id='grpcBodyEntryTextArea'
          type='text'
          placeholder='Type query'
          rows={4}
          onChange={e => this.props.changeHandler(this.props.stream.id, e.target.value)}
         />
      )
    }
    // displays the stream number & delete btn next to the stream body for client or bidirectionbal streaming
    if (this.props.selectedStreamingType === "CLIENT STREAM" || this.props.selectedStreamingType === "BIDIRECTIONAL") {
      streamNum = (
        <input
          defaultValue={` Stream ${this.props.streamNum + 1}`}
          className='stream-number'        
          type="text"
          readOnly="readonly"
         />
      );
      deleteStreamBtn = (
        <button 
          className="delete-stream-btn" 
          onClick={() => this.deleteStream(this.props.stream.id)} 
          id={this.props.stream.id}>
          &times;
        </button>
      )
    }
    // pseudocode for the return section: 
    // renders the stream body (and the stream number if for client or bidirectional stream)
    return (
    <div style={{ display: 'flex' }}>
      <div>
        {deleteStreamBtn}
        {streamNum}
      </div>
      {streamBody}
    </div>
    )
  }
}

export default GRPCBodyStream;
