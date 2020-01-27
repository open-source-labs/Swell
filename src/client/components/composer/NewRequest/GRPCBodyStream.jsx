import React from 'react';

const GRPCBodyStream = ({ content, changeHandler, stream, query }) => (
  <div style={styles}>
    <textarea
      value={`Stream ${stream + 1}`}
      className='stream-number'
      style={{ 'resize': 'none' }} 
      type="text"
    ></textarea>
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

export default GRPCBodyStream;

