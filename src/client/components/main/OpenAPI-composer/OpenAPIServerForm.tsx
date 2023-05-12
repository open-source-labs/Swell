import React from 'react';
import { useSelector } from 'react-redux';
import { OpenAPIRequest } from '../../../../types';
import ContentReqRowComposer from '../sharedComponents/requestForms/ContentReqRowComposer';
import { RootState, useAppDispatch } from '../../../toolkit-refactor/store';
import { NewRequestOpenApi } from '../../../toolkit-refactor/slices/newRequestOpenApiSlice';

interface Props {
  newRequestsOpenAPI: OpenAPIRequest;
  openApiRequestsReplaced: (data: OpenAPIRequest) => void;
}

const OpenAPIServerForm: React.FC<Props> = ({
  newRequestsOpenAPI,
  openApiRequestsReplaced,
}) => {

  const dispatch = useAppDispatch()
  const serversRemovedByIndex = useSelector((state: RootState) => state.serversRemovedByIndex);

  const deleteSever = (index: number) => {
    const newServers = structuredClone(newRequestsOpenAPI?.openapiMetadata?.serverUrls);
    newServers.splice(index, 1);
    serversRemovedByIndex(newServers)
  };

  const onChangeUpdateHeader = (
    id: string, 
    field: 'key' | 'value' | 'active', 
    value: boolean | string | number
    ) => {
    const serversDeepCopy = structuredClone(newRequestsOpenAPI?.openapiMetadata?.serverUrls);
    // find server to update
    let indexToBeUpdated: number = -1
    for (let i = 0; i < serversDeepCopy.length; i += 1) {
      if (serversDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }

    // update
    serversDeepCopy[indexToBeUpdated][field] = value;

    // also switch checkbox if they are typing
    if (field === 'key' || field === 'value') {
      serversDeepCopy[indexToBeUpdated].active = true;
    }

    dispatch(openApiRequestsReplaced({serverUrls: serversDeepCopy}));
  };

  const serversArr = newRequestsOpenAPI?.openApiMetadata?.serverUrls?.map(
    (server: string{}, index: number) => {
      console.log(' OpenApi Server form -> newRequestsOpenAPI', newRequestsOpenAPI);
      const contentTypeServer = {
        id: Math.random() * 1000000,
        active: true,
        key: `Server ${index + 1}`,
        value: server,
      };
      return (
        <ContentReqRowComposer
          data={contentTypeServer}
          deleteItem={deleteSever}
          index={index}
          type="header-row"
          changeHandler={onChangeUpdateHeader}
          key={`${index}`}
        />
      );
    }
  );

  const isDark = useSelector((state: RootState) => state.ui.isDark);

  return (
    <div className="mt-2">
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="composer-section-title">Servers</div>
        <button
          className={`${
            isDark ? 'is-dark-300' : ''
          } button is-small add-header-or-cookie-button`}
        >
          + Server
        </button>
      </div>
      <div>{serversArr && serversArr}</div>
    </div>
  );
};

export default OpenAPIServerForm;
