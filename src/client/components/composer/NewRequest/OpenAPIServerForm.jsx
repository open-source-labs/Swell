import React from 'react';
import ContentReqRowComposer from './ContentReqRowComposer';

export default function OpenAPIServerForm({
  newRequestsOpenAPI,
  setNewRequestsOpenAPI,
}) {
  const onChangeUpdateHeader = (id, field, value) => {
    const serversDeepCopy = JSON.parse(
      JSON.stringify(newRequestsOpenAPI.openapiMetadata.serverUrls)
    );
    // find server to update
    let indexToBeUpdated;
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

    setNewRequestsOpenAPI({
      serverUrls: serversDeepCopy,
    });
  };

  const serversArr = newRequestsOpenAPI?.openapiMetadata?.serverUrls?.map(
    (server, index) => {
      const contentTypeServer = {
        id: Math.random() * 1000000,
        active: true,
        key: `Server ${index + 1}`,
        value: server,
      };
      return (
        <ContentReqRowComposer
          data={contentTypeServer}
          index={index}
          type="header-row"
          changeHandler={onChangeUpdateHeader}
          key={index}
        />
      );
    }
  );

  return (
    <div className="mt-2">
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="composer-section-title">Servers</div>
        <button className="button is-small add-header-or-cookie-button">
          + Server
        </button>
      </div>
      <div>{serversArr && serversArr}</div>
    </div>
  );
}
