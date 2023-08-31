import React from 'react';
import { useAppSelector } from '~/toolkit/store';
import graphQLController from '~/controllers/graphQLController';
import TextCodeArea from '~/components/main/sharedComponents/TextCodeArea';

const GraphQLIntrospectionLog: React.FC = () => {
  const newReq = useAppSelector((store) => store.newRequest);
  const url = useAppSelector((store) => store.newRequestFields.url);
  const introspectionData = useAppSelector((store) => store.introspectionData);
  const isDark = useAppSelector((store) => store.ui.isDark);

  const headers = newReq.newRequestHeaders.headersArr;
  const cookies = newReq.newRequestCookies.cookiesArr;

  return (
    <div>
      <button
        className={`${
          isDark ? 'is-dark-200' : ''
        } button is-small add-header-or-cookie-button`}
        onClick={() => graphQLController.introspect(url, headers, cookies)}
      >
        Introspect
      </button>
      <div id="gql-introspection">
        {/**
         * @todo 2023-08-30 - Only formatted code; logic untouched. Need to
         * figure out what this condition was trying to account for.
         */}
        {introspectionData ===
          'Error: Please enter a valid GraphQL API URI' && (
          <div>{introspectionData}</div>
        )}

        {introspectionData.schemaSDL !== null && (
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
