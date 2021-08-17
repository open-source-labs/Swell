import ipcRenderer from 'electron';

const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';


const webRTCDataChannelController = {
  receiveWebRtcDataStream (event, reqResObj) {
    const pc = reqResObj.webRtcObj.peerConnection;
    pc.ondatachannel = (event) => {
      const { channel } = event;
      channel.binaryType = 'arraybuffer';
      const receivedBuffers = [];
      channel.onmessage = this.handleReceiveMessage;
    }
    
  },
  sendWebRtcDataStream (event, reqResObj, data) {
    const label = data.name;
    const dc = pc.createDataChannel(label);
    
  },

  handleReceiveMessage = async (event) => {
    const { data } = event;
    if (data !== END_OF_FILE_MESSAGE) receivedBuffers.push(data);
    }
  }
}



pc.ondatachannel = (event) => {
  const { channel } = event;
  channel.binaryType = 'arraybuffer';

  const receivedBuffers = [];
  channel.onmessage = async (event) => {
    const { data } = event;
    try {
      if (data !== END_OF_FILE_MESSAGE) {
        receivedBuffers.push(data);
      } else {
        const arrayBuffer = receivedBuffers.reduce((acc, arrayBuffer) => {
          const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
          tmp.set(new Uint8Array(acc), 0);
          tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
          return tmp;
        }, new Uint8Array());
        const blob = new Blob([arrayBuffer]);
        downloadFile(blob, channel.label);
        channel.close();
      }
    } catch (err) {
      console.log('File transfer failed');
    }
  };
};

const shareFile = () => {
  if (file) {
    const channelLabel = file.name;
    const channel = peerConnection.createDataChannel(channelLabel);
    channel.binaryType = 'arraybuffer';

    channel.onopen = async () => {
      const arrayBuffer = await file.arrayBuffer();
      for (let i = 0; i < arrayBuffer.byteLength; i += MAXIMUM_MESSAGE_SIZE) {
        channel.send(arrayBuffer.slice(i, i + MAXIMUM_MESSAGE_SIZE));
      }
      channel.send(END_OF_FILE_MESSAGE);
    };

    channel.onclose = () => {
      // closeDialog();
    };
  }
};

const downloadFile = (blob, fileName) => {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

module.exports = () => {
  ipcRenderer.on("")
}