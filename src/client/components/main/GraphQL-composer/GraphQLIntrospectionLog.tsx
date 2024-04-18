import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import { GraphQLSchema } from 'graphql';

import graphQLController from '../../../controllers/graphQLController';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { RootState } from '../../../toolkit-refactor/store';

interface IntrospectionData {
  schemaSDL: string | null;
  clientSchema: GraphQLSchema | null;
}

const GraphQLIntrospectionLog: React.FC = () => {
  const headers = useAppSelector(
    (store: RootState) => store.newRequest.newRequestHeaders.headersArr
  );
  const cookies = useAppSelector(
    (store: RootState) => store.newRequest.newRequestCookies.cookiesArr
  );
  const introspectionData: (IntrospectionData | string) = useAppSelector(
    (store: RootState) => store.introspectionData
  );
  const url: string = useAppSelector(
    (store: RootState) => store.newRequestFields.url
  );
  const isDark: boolean = useAppSelector((store: RootState) => store.ui.isDark);

  return (
    <div>
      <button
        className={`button is-small ${isDark ? 'is-dark-300' : 'is-outlined'} is-primary`}
        onClick={() => graphQLController.introspect(url, headers, cookies)}
      >
        Introspect
      </button>
      <div id="gql-introspection">
      {/* added the .schemaSDL and toString() below to fix type errors. Not sure the intent of the original engineer */}
        {introspectionData.schemaSDL === 'Error: Please enter a valid GraphQL API URI' && (
          <div>{introspectionData.toString()}</div>
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
