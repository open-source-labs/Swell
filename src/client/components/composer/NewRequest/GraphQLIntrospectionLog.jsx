import React, { Component } from "react";
import dropDownArrow from "../../../../assets/icons/arrow_drop_down_white_192x192.png";
import { render } from "react-dom";

class GraphQLIntrospectionLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
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
    console.log(introspectionData);
    return (
      <div>
        <div
          className="composer_subtitle"
          onClick={this.toggleShow}
          style={this.props.stylesObj}
        >
          <img className={arrowClass} src={dropDownArrow}></img>
          Schema Introspection
        </div>
        <textarea
          readOnly
          className={`composer_textarea gql introspection ${bodyContainerClass}`}
          value={introspectionData}
        />
      </div>
    );
  }
}

export default GraphQLIntrospectionLog;
