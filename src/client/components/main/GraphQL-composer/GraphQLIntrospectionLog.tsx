import React from 'react';
import { useSelector } from 'react-redux';
import { GraphQLSchema } from 'graphql';

import graphQLController from '../../../controllers/graphQLController';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { RootState } from '../../../toolkit-refactor/store';

interface IntrospectionData {
  schemaSDL: string | null;
  clientSchema: GraphQLSchema | null;
}

const GraphQLIntrospectionLog: React.FC = () => {
  const headers = useSelector(
    (store: RootState) => store.newRequest.newRequestHeaders.headersArr
  );
  const cookies = useSelector(
    (store: RootState) => store.newRequest.newRequestCookies.cookiesArr
  );
  const introspectionData: (IntrospectionData | string) = useSelector(
    (store: RootState) => store.introspectionData
  );
  const url: string = useSelector(
    (store: RootState) => store.newRequestFields.url
  );
  const isDark: boolean = useSelector((store: RootState) => store.ui.isDark);

  return (
    <div>
      <button
        className={`${isDark ? 'is-dark-200' : ''} button is-small add-header-or-cookie-button`}
        onClick={() => graphQLController.introspect(url, headers, cookies)}
      >
        Introspect
      </button>
      <div id="gql-introspection">
        {introspectionData === 'Error: Please enter a valid GraphQL API URI' && (
          <div>{introspectionData}</div>
        )}
        {!!introspectionData.schemaSDL && (
          <TextCodeArea
            value={introspectionData.schemaSDL}
            mode="application/json"
            onChange={() => {}}
            readOnly={true}
          />
        )}
      </div>
    </div>
  );
};

export default GraphQLIntrospectionLog;










// import React from 'react';
// import { useSelector } from 'react-redux';
// import graphQLController from '../../../controllers/graphQLController';
// import TextCodeArea from '../new-request/TextCodeArea.tsx';

// const GraphQLIntrospectionLog = () => {
//   const headers = useSelector(
//     (store) => store.newRequest.newRequestHeaders.headersArr
//   );
//   const cookies = useSelector(
//     (store) => store.newRequest.newRequestCookies.cookiesArr
//   );
//   const introspectionData = useSelector((store) => store.introspectionData);
//   const url = useSelector((store) => store.newRequestFields.url);
//   const isDark = useSelector((store) => store.ui.isDark);

//   return (
//     <div>
//       <button
//         className={`${
//           isDark ? 'is-dark-200' : ''
//         } button is-small add-header-or-cookie-button`}
//         onClick={() => graphQLController.introspect(url, headers, cookies)}
//       >
//         Introspect
//       </button>
//       <div id="gql-introspection">
//         {introspectionData ===
//           'Error: Please enter a valid GraphQL API URI' && (
//           <div>{introspectionData}</div>
//         )}
//         {!!introspectionData.schemaSDL && (
//           <TextCodeArea
//             value={introspectionData.schemaSDL}
//             mode="application/json"
//             onChange={() => {}}
//             readOnly={true}
//           />
//         )}
//       </div>
//     </div>
//   );
// };
// export default GraphQLIntrospectionLog;
