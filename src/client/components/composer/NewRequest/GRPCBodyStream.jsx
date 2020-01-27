// import React, { Component } from 'react';

// class GRPCBodyStream extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       show: true,
//     };
//   }

//   render() {
//     return (
//       <div >
//         <textarea
//           value={this.props.newRequestBody.bodyContent}
//           className={'composer_textarea grpc'}
//           id='grpcBodyEntryTextArea'
//           style={{ 'resize': 'none' }} 
//           type='text'
//           placeholder='Type query'
//           rows={6}
//           onChange={(e) => {
//             this.props.setNewRequestBody({
//               ...this.props.newRequestBody,
//               bodyContent: e.target.value
//             })
//           }}
//         ></textarea>
//       </div>
//     );
//   }
// }

// export default GRPCBodyStream;


import React from 'react';
import PropTypes from 'prop-types';

const GRPCBodyStream = ({ content, changeHandler, query }) => (
  <div style={styles}>
    <textarea
      value={query}
      className={"composer_textarea grpc"}
      id='grpcBodyEntryTextArea'
      style={{ 'resize': 'none' }} 
      type='text'
      placeholder='Type query'
      rows={3}
      onChange={e => changeHandler(content.id, e.target.value)}
    ></textarea>
  </div>
)

const styles = { display: 'flex' };

GRPCBodyStream.propTypes = {
  content: PropTypes.object.isRequired,
  changeHandler: PropTypes.func.isRequired,
};

export default GRPCBodyStream;

