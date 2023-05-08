const YAML = require('yamljs');
import {
    WindowExt,
    $TSFixMe
  } from '../../types';

import { appDispatch } from '../toolkit-refactor/store';
const { api } = window as unknown as WindowExt;
import { openApiRequestsReplaced } from '../toolkit-refactor/slices/newRequestOpenApiSlice'

const openApiController: $TSFixMe = {

    importDocument(): void {
        // console.log('importing document');
        //listens for imported openapi document from main process
        api.receive('openapi-info', async function receiveOpenAPI(data1: any, data2: any) {
            try {
                console.log('received openapi-info data_1', typeof data1, YAML.parse(data1));
                console.log('received openapi-info data_2', typeof data2)
              
                const data = YAML.parse(data1)
                const testObj: any = {openApiMetadata: {
                    info: data.info,
                    tags: data.tags,
                    serverUrls: data.serverUrls,
                    openApiReqArr: data.openApiReqArr
                }}

                console.log('Test Object',testObj)
                
                appDispatch(openApiRequestsReplaced(testObj));
            } catch (err) {
                console.log('Error in openAPI Controller: ', err)
            }
        })
        api.send('import-openapi');
        },
}

export default openApiController;