// import React, { Component } from 'react';

// class GRPCBodyStream extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     let bodyType;
//     if (this.props.selectedStreamingType === "CLIENT STREAM" || this.props.selectedStreamingType === "BIDIRECTIONAL") {
//       bodyType = (
//       <input
//         defaultValue={` Stream ${this.props.stream + 1}`}
//         className='stream-number'
//         style={{ 'resize': 'none' }} 
//         type="text"
//       ></input>
//       )
//     }
//     const styles = { display: 'flex' };
//     return (
//     <div style={styles}>
//       <textarea
//         value={`{
//           ${this.props.selectedQuery ? this.props.selectedQuery : ''}
// }`}
//         className={"composer_textarea grpc"}
//         id='grpcBodyEntryTextArea'
//         style={{ 'resize': 'none' }} 
//         type='text'
//         placeholder='Type query'
//         rows={3}
//         onChange={e => this.props.changeHandler(this.props.content.id, e.target.value)}
//       ></textarea>
//       {bodyType}
//     </div>
//     )
//   }
// }

// export default GRPCBodyStream;



import React, { Component } from 'react';

class GRPCBodyStream extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let bodyType;
    let streamBody;
    if (this.props.newRequestStreams.count === 1) {
      streamBody = (
        <textarea
          value={`{
            ${this.props.selectedQuery ? this.props.selectedQuery : ''}
}`}
          className={"composer_textarea grpc"}
          id='grpcBodyEntryTextArea'
          style={{ 'resize': 'none' }} 
          type='text'
          placeholder='Type query'
          rows={3}
          onChange={e => this.props.changeHandler(this.props.content.id, e.target.value)}
        ></textarea>
      )
    } else {
      streamBody = (
        <textarea
          value={this.newRequestStreams.streamContent}
          className={"composer_textarea grpc"}
          id='grpcBodyEntryTextArea'
          style={{ 'resize': 'none' }} 
          type='text'
          placeholder='Type query'
          rows={3}
          onChange={e => this.props.changeHandler(this.props.content.id, e.target.value)}
        ></textarea>
      )
    }
    if (this.props.selectedStreamingType === "CLIENT STREAM" || this.props.selectedStreamingType === "BIDIRECTIONAL") {
      bodyType = (
      <input
        defaultValue={` Stream ${this.props.stream + 1}`}
        className='stream-number'
        style={{ 'resize': 'none' }} 
        type="text"
      ></input>
      )
    }
    const styles = { display: 'flex' };
    return (
    <div style={styles}>
      {streamBody}
      {bodyType}
    </div>
    )
  }
}

export default GRPCBodyStream;

