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
        api.removeAllListeners('openapi-info');
        api.receive('openapi-info', async (data_in: $TSFixMe) => {
            console.log('openAPIController', typeof data_in, data_in)
            try {

                console.log('openMetaData',data_in.openapiMetadata)
                
                appDispatch(openApiRequestsReplaced(data_in));
            } catch (err) {
                console.log('Error in openAPI Controller: ', err)
            }
        })
    },
    sendDocument(): void {
        api.send('import-openapi');
    },
}

export default openApiController;