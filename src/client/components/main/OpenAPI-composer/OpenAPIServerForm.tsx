import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import ContentReqRowComposer from '../sharedComponents/requestForms/ContentReqRowComposer';
import { $TSFixMe, OpenAPIRequest } from '../../../../types';
import { openApiRequestsReplaced } from '../../../toolkit-refactor/slices/newRequestOpenApiSlice';
import { RootState, useAppDispatch } from '../../../toolkit-refactor/store';


interface OpenAPIServerFormProps {
  newRequestsOpenAPI: OpenAPIRequest;
  openApiRequestsReplaced: (data: OpenAPIRequest) => void;
}

interface NewServer {
  index: number;
  str: string
}

const OpenAPIServerForm: React.FC<OpenAPIServerFormProps> = ({
  newRequestsOpenAPI,
  openApiRequestsReplaced,
}) => {

  const [contentDataArr, setContentDataArr]: $TSFixMe = useState([])

  useEffect(() => {
    if (newRequestsOpenAPI?.openapiMetadata?.serverUrls) {
      const serverUrls: string[] = newRequestsOpenAPI.openapiMetadata.serverUrls
      const updatedServers = serverUrls.map((server: string, index: number) => {
        return {
          id: Math.floor(Math.random() * 1000000),
          active: true,
          key: `Server ${index + 1}`,
          value: server,
        }
      })
      setContentDataArr(updatedServers || []);
    }
  }, [newRequestsOpenAPI])


  // Responsible for adding servers to the OpenAPI request
  const addServer = (url: string = '') => {
    const newOpenApi = structuredClone(newRequestsOpenAPI);

    if (newOpenApi?.openapiMetadata?.serverUrls) {
      const index = newOpenApi.openapiMetadata.serverUrls.length;
      const str = url
      newOpenApi.openapiMetadata.serverUrls.push({index: str});

      openApiRequestsReplaced({...newOpenApi})
    }
  };

  // Responsible for deleting servers to the OpenAPI request
  const deleteServer = (index: number) => {
    const newOpenApi = structuredClone(newRequestsOpenAPI);

    newOpenApi?.openapiMetadata?.serverUrls.splice(index, 1)

    if (newOpenApi?.openapiMetadata?.serverUrls) {
      openApiRequestsReplaced({...newOpenApi})
    }
  };
  
  // Responsible for changing/updating the input fields of the servers
  const onChangeUpdateHeader = (
    id: string, 
    field: 'key' | 'value' | 'active', 
    value: boolean | string | number
    ) => {
    // const newOpenApi = structuredClone(newRequestsOpenAPI)
    // const serversDeepCopy: string[] = newOpenApi.openapiMetadata.serverUrls;
    const updatedContentDataArr = [ ...contentDataArr ];

    // find server to update (update in component state)
    for (let i = 0; i < contentDataArr.length; i += 1) {
      if (contentDataArr[i].id === id) {
        // check or uncheck the box
        if (field === 'active') {
          updatedContentDataArr[i].active = value
        }
        if (field === 'key') {
          console.log(contentDataArr[i].value)
          updatedContentDataArr[i].key = value
        }
        if (field === 'value') {
          console.log(contentDataArr[i].value)
          updatedContentDataArr[i].value = value
        }
        setContentDataArr(updatedContentDataArr)
        // openApiRequestsReplaced({...newOpenApi});
      }
    }
  };

  const serversArr = contentDataArr.map(
    (server: string, index: number) => {
      return (
        <ContentReqRowComposer
          data={contentDataArr[index]}
          index={index}
          type="header-row"
          changeHandler={onChangeUpdateHeader}
          key={index}
          deleteItem={deleteServer}
        />
      );
    }
  );

  const isDark = useSelector((state: RootState) => state.ui.isDark);

  return (
    <div className="mt-2">
      {JSON.stringify(contentDataArr)}
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="composer-section-title">Servers</div>
        <button
          onClick={() => addServer()}
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

// import React from 'react';
// import { useSelector } from 'react-redux';
// import ContentReqRowComposer from '../sharedComponents/requestForms/ContentReqRowComposer.tsx';

// export default function OpenAPIServerForm({
//   newRequestsOpenAPI,
//   openApiRequestsReplaced,
// }) {

  // const onChangeUpdateHeader = (id, field, value) => {
  //   const serversDeepCopy = structuredClone(newRequestsOpenAPI.openapiMetadata.serverUrls);
  //   // find server to update
  //   let indexToBeUpdated;
  //   for (let i = 0; i < serversDeepCopy.length; i += 1) {
  //     if (serversDeepCopy[i].id === id) {
  //       indexToBeUpdated = i;
  //       break;
  //     }
  //   }

  //   // update
  //   serversDeepCopy[indexToBeUpdated][field] = value;

  //   // also switch checkbox if they are typing
  //   if (field === 'key' || field === 'value') {
  //     serversDeepCopy[indexToBeUpdated].active = true;
  //   }

  //   openApiRequestsReplaced({
  //     serverUrls: serversDeepCopy,
  //   });
  // };

//   const serversArr = newRequestsOpenAPI?.openapiMetadata?.serverUrls?.map(
//     (server, index) => {

//       console.log(' OpenApi Server form -> newRequestsOpenAPI',newRequestsOpenAPI)
//       const contentTypeServer = {
//         id: Math.random() * 1000000,
//         active: true,
//         key: `Server ${index + 1}`,
//         value: server,
//       };
//       return (
//         <ContentReqRowComposer
//           data={contentTypeServer}
//           index={index}
//           type="header-row"
//           changeHandler={onChangeUpdateHeader}
//           key={index}
//         />
//       );
//     }
//   );

//   const isDark = useSelector((state) => state.ui.isDark);

//   return (
//     <div className="mt-2">
//       <div className="is-flex is-justify-content-space-between is-align-content-center">
//         <div className="composer-section-title">Servers</div>
//         <button
//           className={`${
//             isDark ? 'is-dark-300' : ''
//           } button is-small add-header-or-cookie-button`}
//         >
//           + Server
//         </button>
//       </div>
//       <div>{serversArr && serversArr}</div>
//     </div>
//   );
// }
