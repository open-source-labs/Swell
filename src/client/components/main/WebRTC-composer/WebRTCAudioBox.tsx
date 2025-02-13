import React from 'react';
// possibly not the best practice implementation for audio playback ?
interface Props {
  streamType: 'localstream' | 'remotestream';
}
const WebRTCAudioBox: React.FC<Props> = (props: Props) => {
  const { streamType } = props;
  return (
    <div className="m-1" style={{ maxWidth: '350px', position: 'relative' }}>
      <video
        id={`${streamType}`}
        autoPlay
        playsInline
        style={{ width: '0%', height: '0%' }}
      ></video>
      <a
        className="is-rest-invert pl-2 pr-2 p-1 mb-2 mr-2"
        style={{ position: 'absolute', bottom: '10px', right: '10px' }}
      >
        {streamType}
      </a>
    </div>
  );
};

export default WebRTCAudioBox;

