import {
    WindowExt,
    NewRequestStreams,
    $TSFixMe
  } from '../../types';

import { appDispatch } from '../toolkit-refactor/store';
const { api } = window as unknown as WindowExt;

import { newRequestStreamsSet } from '../toolkit-refactor/slices/newRequestSlice';

const grpcController: $TSFixMe = {

    protoParserReturn(newRequestStreams: NewRequestStreams): void {
        
        try {
            // Set up the listener when for parsed protos entered into textFieldArea
            api.removeAllListeners('protoParserFunc-return');
            
            api.receive('protoParserFunc-return', async function parsedProtoRes(data: string) {
                try{
                    const result: $TSFixMe = await JSON.parse(data)
                    
                    const services = result.serviceArr ? result.serviceArr : null;
                    const protoPath = result.protoPath ? result.protoPath : null;
                    const streamsArr = [newRequestStreams.streamsArr[0]];
                    const streamContent = [''];
    
                    const updatedNewRequestStream: NewRequestStreams = {
                    ...newRequestStreams,
                    selectedPackage: null,
                    selectedService: null,
                    selectedRequest: null,
                    selectedStreamingType: null,
                    selectedServiceObj: null,
                    services,
                    protoPath,
                    streamsArr,
                    streamContent,
                    count: 10,
                    }
    
                    appDispatch(newRequestStreamsSet(updatedNewRequestStream))
                } catch (err) {
                    console.log(err)
                }
            });
        } catch(err) {
        console.error(err)
        }
    },
    sendParserData(data: string): void {
        api.send('protoParserFunc-request', data);
    },
    importProto(newRequestStreams: $TSFixMe): void {
    // clear all stream bodies except first one upon clicking on import proto file
    const streamsArr = [newRequestStreams.streamsArr[0]];
    const streamContent = [''];
    // reset streaming type next to the URL & reset Select Service dropdown to default option
    // reset selected package name, service, request, streaming type & protoContent

    if (newRequestStreams.protoContent !== null) {
        const updatedNewRequestStream: NewRequestStreams = {
        ...newRequestStreams,
        selectedPackage: null,
        selectedService: null,
        selectedRequest: null,
        selectedStreamingType: null,
        services: [],
        protoContent: '',
        streamsArr,
        streamContent,
        count: 1,
      };
      appDispatch(newRequestStreamsSet(updatedNewRequestStream))
    }
    
    // listens for imported proto content from main process
    api.receive('proto-info', async (proto: $TSFixMe, unparsedProtoObj:$TSFixMe) => {
     try {
      const readProto = await JSON.parse(proto);
      const parsedProto = await JSON.parse(unparsedProtoObj)
      
      
    const updatedNewRequestStream: NewRequestStreams = {
        ...newRequestStreams,
        protoContent: readProto,
        services: parsedProto.serviceArr,
        protoPath: parsedProto.protoPath,
      };
      appDispatch(newRequestStreamsSet(updatedNewRequestStream))
     } catch (err) {
      throw new Error('Error receiving parsed uploaded proto');
     }
    });
    api.send('import-proto');
    }
}

export default grpcController;