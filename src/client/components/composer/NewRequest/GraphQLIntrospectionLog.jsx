import React, { useState } from "react";
import graphQLController from "../../../controllers/graphQLController";

const GraphQLIntrospectionLog = (props) => {
  const [show, toggleShow] = useState(false);
  const { introspectionData, url } = props;
  const bodyContainerClass = show
    ? "composer_bodyform_container-open-grpc"
    : "composer_bodyform_container-closed";
  const logAreaClass =
    introspectionData.schemaSDL &&
    introspectionData !== "Error: Please enter a valid GraphQL API URI"
      ? "introspection-big"
      : "introspection-small";
  return (
    <div>
      <label
      className='composer_subtitle' >
        <div className="label-text" id="cookie-click">Schema</div>
        <div className="toggle">
          <input type="checkbox" name="check" className="toggle-state" onClick={() => toggleShow((show) => !show)}/>
          <div className="indicator" />
        </div>
      </label>
      <div className={bodyContainerClass}>
        <div style={{ color: "red" }}>
          {introspectionData === "Error: Please enter a valid GraphQL API URI"
            ? introspectionData
            : ""}
        </div>
        <textarea
          readOnly
          className={`composer_textarea gql introspection-small ${logAreaClass}`}
          value={
            introspectionData.schemaSDL ||
            'Click "Introspect" to view GraphQL Schema' ||
            introspectionData
          }
        />
        <button
          className="composer_submit gql"
          onClick={() => graphQLController.introspect(url)}
        >
          Introspect
        </button>
      </div>
    </div>
  );
};
export default GraphQLIntrospectionLog;
