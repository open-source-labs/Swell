
import {
    ReqRes,
    Cookie,
    CookieOrHeader,
    WindowExt,
    NewRequestStreams,
    $TSFixMe
  } from '../../types';

import Store, { appDispatch } from '../toolkit-refactor/store';
const { api } = window as unknown as WindowExt;

import {
    composerFieldsReset,
    newRequestSSESet,
    newRequestCookiesSet,
    newRequestStreamsSet,
    newRequestBodySet,
    newRequestHeadersSet,
  } from '../toolkit-refactor/slices/newRequestSlice';

import {
    responseDataSaved,
    reqResUpdated,
  } from '../toolkit-refactor/reqRes/reqResSlice';

// interface grpcController {

// }

const grpcController: any = {

    protoParserReturn(newRequestStreams: NewRequestStreams): Promise<any> {
        try {
            // Set up the listener when for parsed protos entered into textFieldArea
            api.removeAllListeners('protoParserFunc-return');
            api.receive('protoParserFunc-return', (result: $TSFixMe) => {
            // if there is an error
            // if (data.error) {
                // showError('.proto parsing error: Please enter or import valid .proto');
                // saveChanges(false);
                // reject(data.error);
            // } else {
                // showError(null);
                // saveChanges(true);
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
                count: 1,
                }

                api.send('protoParserFunc-request', newRequestStreams);

                appDispatch(newRequestStreamsSet(updatedNewRequestStream))
                // }

            });
        } catch(err) {
        console.error(err)
        }
    },
    // sendParserData(data: any): Promise<any> {
    //     return new Promise((resolve) => {
    //         api.removeAllListeners('protoParserFunc-return')
    //         api.send('protoParserFunc-request', data);
    //     })
    // }

}

export default grpcController;