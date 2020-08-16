import React, { useState } from "react";
import dropDownArrow from "../../../../assets/icons/arrow_drop_down_white_192x192.png";
import graphQLController from "../../../controllers/graphQLController";

const GraphQLIntrospectionLog = (props) => {
  const [show, toggleShow] = useState(false);

  const { introspectionData, url } = props;
  const arrowClass = show
    ? "composer_subtitle_arrow-open"
    : "composer_subtitle_arrow-closed";
  const bodyContainerClass = show
    ? "composer_bodyform_container-open"
    : "composer_bodyform_container-closed";
  const logAreaClass =
    introspectionData &&
    introspectionData !== "Error: Please enter a valid GraphQL API URI"
      ? "introspection-big"
      : "introspection-small";

  return (
    <div>
      <div
        className="composer_subtitle"
        onClick={() => toggleShow((show) => !show)}
        style={props.stylesObj}
      >
        <img className={arrowClass} src={dropDownArrow}></img>
        Schema
      </div>
      <div className={bodyContainerClass}>
        <textarea
          readOnly
          className={`composer_textarea gql introspection-small ${logAreaClass}`}
          value={
            introspectionData || 'Click "Introspect" to view GraphQL Schema'
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
