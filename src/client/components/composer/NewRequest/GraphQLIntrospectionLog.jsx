import React, { Component } from "react";
import dropDownArrow from "../../../../assets/icons/arrow_drop_down_white_192x192.png";
import graphQLController from "../../../controllers/graphQLController";

import { render } from "react-dom";

class GraphQLIntrospectionLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.toggleShow = this.toggleShow.bind(this);
  }
  toggleShow() {
    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    const { introspectionData, url } = this.props;
    const arrowClass = this.state.show
      ? "composer_subtitle_arrow-open"
      : "composer_subtitle_arrow-closed";
    const bodyContainerClass = this.state.show
      ? "composer_bodyform_container-open"
      : "composer_bodyform_container-closed";
    const logAreaClass = introspectionData
      ? "introspection-big"
      : "introspection-small";

    return (
      <div>
        <div
          className="composer_subtitle"
          onClick={this.toggleShow}
          style={this.props.stylesObj}
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
  }
}

export default GraphQLIntrospectionLog;
