import { type WindowExt, type $TSFixMe } from '~/types';
import { appDispatch } from '../rtk/store';
import { openApiRequestsReplaced } from '../rtk/slices/newRequestOpenApiSlice';

const { api } = window as unknown as WindowExt;

const openApiController: $TSFixMe = {
  importDocument(): void {
    api.removeAllListeners('openapi-info');
    api.receive('openapi-info', async (data_in: $TSFixMe) => {
      try {
        appDispatch(openApiRequestsReplaced(data_in));
      } catch (err) {
        // If swell ever gets big enough, this needs to be built out
        console.log('Error in openAPI Controller: ', err);
      }
    });
  },
  sendDocument(): void {
    api.send('import-openapi');
  },
};

export default openApiController;

