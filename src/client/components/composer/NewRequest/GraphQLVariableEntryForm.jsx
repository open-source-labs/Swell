import React, { Component } from "react";
import { connect } from "react-redux";
import dropDownArrow from "../../../../assets/icons/arrow_drop_down_white_192x192.png";

class GraphQLVariableEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show,
    });
  }

  handleKeyPress(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      const gqlVariableEntryTextArea = document.querySelector(
        "#gqlVariableEntryTextArea"
      );
      const start = gqlVariableEntryTextArea.selectionStart;
      const second = gqlVariableEntryTextArea.value.substring(
        gqlVariableEntryTextArea.selectionStart
      );
      // if you call the action/reducer, cursor jumps to bottom, this will update the textarea value without modifying state but it's fine because any subsequent keys will
      // to account for edge case where tab is last key entered, alter addNewReq in ComposerNewRequest.jsx
      // this.props.setNewRequestBody({
      //   ...this.props.newRequestBody,
      //   bodyContent: gqlVariableEntryTextArea.value.substring(0, start) + `  ` + gqlVariableEntryTextArea.value.substring(start)
      // })
      gqlVariableEntryTextArea.value =
        gqlVariableEntryTextArea.value.substring(0, start) +
        `  ` +
        gqlVariableEntryTextArea.value.substring(start);
      gqlVariableEntryTextArea.setSelectionRange(
        gqlVariableEntryTextArea.value.length - second.length,
        gqlVariableEntryTextArea.value.length - second.length
      );
    }
  }

  render() {
    const arrowClass = this.state.show
      ? "composer_subtitle_arrow-open"
      : "composer_subtitle_arrow-closed";
    const bodyContainerClass = this.state.show
      ? "composer_bodyform_container-open"
      : "composer_bodyform_container-closed";

    return (
      <div>
        <div
          className="composer_subtitle"
          onClick={this.toggleShow}
          style={this.props.stylesObj}
        >
          <img className={arrowClass} src={dropDownArrow}></img>
          Variables
        </div>

        <textarea
          value={this.props.newRequestBody.bodyVariables}
          className={"composer_textarea gql " + bodyContainerClass}
          id="gqlVariableEntryTextArea"
          style={{ resize: "none" }} //tried making top-margin/topMargin -10px but it didn't care
          type="text"
          placeholder="Variables"
          rows={5}
          onKeyDown={(e) => this.handleKeyPress(e)}
          onChange={(e) => {
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyVariables: e.target.value,
            });
          }}
        ></textarea>
      </div>
    );
  }
}

export default GraphQLVariableEntryForm;
