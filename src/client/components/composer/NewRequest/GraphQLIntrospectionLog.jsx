import React, { useState } from "react";
import graphQLController from "../../../controllers/graphQLController";
import TextCodeAreaReadOnly from './TextCodeAreaReadOnly';

const GraphQLIntrospectionLog = (props) => {

  const { introspectionData, url } = props;
      
  return (
    <div>
       <button
          className="button is-small add-header-or-cookie-button"
          onClick={() => graphQLController.introspect(url)}
        >
          Introspect
        </button>
      <div >
        {introspectionData === "Error: Please enter a valid GraphQL API URI" &&
          <div>{introspectionData}</div> 
        }
        { !!introspectionData.schemaSDL &&
          <TextCodeAreaReadOnly
            value={
              introspectionData.schemaSDL
            }
            theme='neo sidebar'
            mode='application/json'
            onChange={()=>{}}
          />
        }
       
      </div>
    </div>
  );
};
export default GraphQLIntrospectionLog;
