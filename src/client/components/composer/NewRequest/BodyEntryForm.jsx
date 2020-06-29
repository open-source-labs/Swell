import React, { Component } from "react";
import WWWForm from "./WWWForm.jsx";
import BodyTypeSelect from "./BodyTypeSelect.jsx";
import JSONTextArea from "./JSONTextArea.jsx";
import dropDownArrow from "../../../../assets/icons/arrow_drop_down_white_192x192.png";

class BodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = { show: true };
    this.toggleShow = this.toggleShow.bind(this);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    let rawTypeStyles = {
      display: this.props.newRequestBody.bodyType === "raw" ? "block" : "none",
    };

    let bodyEntryArea = (() => {
      //BodyType of none : display nothing
      if (this.props.newRequestBody.bodyType === "none") {
        return;
      }
      //BodyType of XWWW... : display WWWForm entry
      else if (this.props.newRequestBody.bodyType === "x-www-form-urlencoded") {
        return (
          <WWWForm
            setNewRequestBody={this.props.setNewRequestBody}
            newRequestBody={this.props.newRequestBody}
          />
        );
      }
      //RawType of application/json : Text area box with error checking
      else if (this.props.newRequestBody.rawType === "application/json") {
        return (
          <JSONTextArea
            setNewRequestBody={this.props.setNewRequestBody}
            newRequestBody={this.props.newRequestBody}
          />
        );
      }
      //all other cases..just plain text area
      else {
        return (
          <textarea
            value={this.props.newRequestBody.bodyContent}
            className={"composer_textarea"}
            style={{ resize: "none" }}
            type="text"
            placeholder="Body"
            rows={10}
            onChange={(e) => {
              this.props.setNewRequestBody({
                ...this.props.newRequestBody,
                bodyContent: e.target.value,
              });
            }}
          ></textarea>
        );
      }
    })();

    const arrowClass = this.state.show
      ? "composer_subtitle_arrow-open"
      : "composer_subtitle_arrow-closed";
    const bodyContainerClass = this.state.show
      ? "composer_bodyform_container-open"
      : "composer_bodyform_container-closed";

    return (
      <div style={this.props.stylesObj}>
        <div
          className="composer_subtitle"
          onClick={this.toggleShow}
          style={this.props.stylesObj}
        >
          <img className={arrowClass} src={dropDownArrow}></img>
          Body
        </div>

        <div className={bodyContainerClass}>
          <BodyTypeSelect
            setNewRequestBody={this.props.setNewRequestBody}
            newRequestBody={this.props.newRequestBody}
            setNewRequestHeaders={this.props.setNewRequestHeaders}
            newRequestHeaders={this.props.newRequestHeaders}
          />

          <div className="composer_rawtype_textarea_container">
            <select
              style={rawTypeStyles}
              className={"composer_rawtype_select"}
              onChange={(e) =>
                this.props.setNewRequestBody({
                  ...this.props.newRequestBody,
                  rawType: e.target.value,
                })
              }
              value={this.props.newRequestBody.rawType}
            >
              Raw Type:
              <option value="text/plain">Text (text/plain)</option>
              <option value="application/json">JSON (application/json)</option>
              <option value="application/javascript">
                Javascript (application/javascript)
              </option>
              <option value="application/xml">XML (application/xml)</option>
              <option value="text/xml">XML (text/xml)</option>
              <option value="text/html">HTML (text/html)</option>
            </select>
            {bodyEntryArea}
          </div>
        </div>
      </div>
    );
  }
}

export default BodyEntryForm;
