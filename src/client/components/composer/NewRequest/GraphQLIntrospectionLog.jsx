import React from 'react';
import { useSelector } from 'react-redux';
import graphQLController from '../../../controllers/graphQLController';
import TextCodeArea from './TextCodeArea';

const GraphQLIntrospectionLog = () => {
  const headers = useSelector(
    (store) => store.business.newRequestHeaders.headersArr
  );
  const cookies = useSelector(
    (store) => store.business.newRequestCookies.cookiesArr
  );
  const introspectionData = useSelector(
    (store) => store.business.introspectionData
  );
  const url = useSelector((store) => store.business.newRequestFields.url);
  const isDark = useSelector((store) => store.ui.isDark);

  return (
    <div>
      <button
        className={`${isDark ? 'is-dark-200' : ''} button is-small add-header-or-cookie-button`}
        onClick={() => graphQLController.introspect(url, headers, cookies)}
      >
        Introspect
      </button>
      <div id="gql-introspection">
        {introspectionData ===
          'Error: Please enter a valid GraphQL API URI' && (
          <div>{introspectionData}</div>
        )}
        {!!introspectionData.schemaSDL && (
          <TextCodeArea
            value={introspectionData.schemaSDL}
            mode="application/json"
            onChange={() => {}}
            readOnly = {true}
          />
        )}
      </div>
    </div>
  );
};
export default GraphQLIntrospectionLog;
