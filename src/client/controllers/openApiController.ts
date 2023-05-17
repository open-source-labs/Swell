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
            try {

                appDispatch(openApiRequestsReplaced(data_in));
            } catch (err) {
                // If swell ever gets big enough, this needs to be built out
                console.log('Error in openAPI Controller: ', err)
            }
        })
    },
    sendDocument(): void {
        api.send('import-openapi');
    },
}

export default openApiController;