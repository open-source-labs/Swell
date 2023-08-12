import React from 'react';

interface Props {
    streamType: 'localstream' | 'remotestream'
}
const WebRTCVideoBox: React.FC<Props> = (props: Props) => {
    const { streamType } = props
  return (
    <div
    className='m-1'
      style={{maxWidth: '350px', position: 'relative'}}
    >
      <video
        id={`${streamType}`}
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%' }}
      ></video>
      <a className='is-rest-invert pl-2 pr-2 p-1 mb-2 mr-2' style={{position: 'absolute', bottom: '10px', right: '10px'}}>{streamType}</a>
    </div>
  );
};

export default WebRTCVideoBox;
