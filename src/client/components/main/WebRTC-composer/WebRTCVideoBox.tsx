import React from 'react';

interface Props {
    streamType: 'localstream' | 'remotestream'
}
const WebRTCVideoBox: React.FC<Props> = (props: Props) => {
    const { streamType } = props
  return (
    <div
      className='box is-flex'
      style={{width: '500px', height: '500px'}}
    >
      <video
        id={`${streamType}`}
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%' }}
      ></video>
    </div>
  );
};

export default WebRTCVideoBox;
