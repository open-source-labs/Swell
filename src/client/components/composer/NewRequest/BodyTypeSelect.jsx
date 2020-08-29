import React, { Component } from "react";
import PropTypes from "prop-types";

const classNames = require("classnames");

class BodyTypeSelect extends Component {
  constructor(props) {
    super(props);
    this.removeContentTypeHeader = this.removeContentTypeHeader.bind(this);
  }

  removeContentTypeHeader() {
    const filtered = this.props.newRequestHeaders.headersArr.filter(
      (header) => header.key.toLowerCase() !== "content-type"
    );
    this.props.setNewRequestHeaders({
      headersArr: filtered,
      count: filtered.length,
    });
  }

  render() {
    const RawStyleClasses = classNames({
      composer_bodytype_button: true,
      "composer_bodytype_button-selected":
        this.props.newRequestBody.bodyType === "raw",
    });
    const XWWWFormUrlEncodedStyleClasses = classNames({
      composer_bodytype_button: true,
      "composer_bodytype_button-selected":
        this.props.newRequestBody.bodyType === "x-www-form-urlencoded",
    });
    const NoneStyleClasses = classNames({
      composer_bodytype_button: true,
      "composer_bodytype_button-selected":
        this.props.newRequestBody.bodyType === "none",
    });

    return (
      <div
        className="composer_protocol_container httpbody"
        style={{ marginTop: "4px" }}
      >
        <div
          style={{ width: "25%" }}
          className={RawStyleClasses}
          onMouseDown={() =>
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyType: "raw",
            })
          }
        >
          Raw
        </div>
        <div
          style={{ width: "50%" }}
          className={XWWWFormUrlEncodedStyleClasses}
          onMouseDown={() =>
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyType: "x-www-form-urlencoded",
            })
          }
        >
          x-www-form-urlencoded
        </div>
        <div
          style={{ width: "25%" }}
          className={NoneStyleClasses}
          onMouseDown={() => {
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyType: "none",
              bodyContent: "",
            });
            this.removeContentTypeHeader();
          }}
        >
          None
        </div>
      </div>
    );
  }
}

BodyTypeSelect.propTypes = {
  newRequestBody: PropTypes.object.isRequired,
  setNewRequestBody: PropTypes.func.isRequired,
};

export default BodyTypeSelect;
