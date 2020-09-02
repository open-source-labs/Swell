import React, { Component } from "react";
import PropTypes from "prop-types";

class JSONTextArea extends Component {
  constructor(props) {
    super(props);
    this.prettyPrintJSON = this.prettyPrintJSON.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      const jsonBodyEntryTextArea = document.querySelector(
        "#jsonBodyEntryTextArea"
      );
      const start = jsonBodyEntryTextArea.selectionStart;
      const second = jsonBodyEntryTextArea.value.substring(
        jsonBodyEntryTextArea.selectionStart
      );
      // if you call the action/reducer, cursor jumps to bottom, this will update the textarea value without modifying state but it's fine because any subsequent keys will
      // to account for edge case where tab is last key entered, alter addNewReq in ComposerNewRequest.jsx
      // this.props.setNewRequestBody({
      //   ...this.props.newRequestBody,
      //   bodyContent: jsonBodyEntryTextArea.value.substring(0, start) + `  ` + jsonBodyEntryTextArea.value.substring(start)
      // })
      jsonBodyEntryTextArea.value =
        jsonBodyEntryTextArea.value.substring(0, start) +
        `  ` +
        jsonBodyEntryTextArea.value.substring(start);
      jsonBodyEntryTextArea.setSelectionRange(
        jsonBodyEntryTextArea.value.length - second.length,
        jsonBodyEntryTextArea.value.length - second.length
      );
    }
  }

  componentDidMount() {
    if (this.props.newRequestBody.bodyContent === "") {
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        bodyContent: "{}",
      });
      return;
    }
    try {
      JSON.parse(this.props.newRequestBody.bodyContent);
      if (!this.props.newRequestBody.JSONFormatted) {
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          JSONFormatted: true,
        });
      }
    } catch (error) {
      if (this.props.newRequestBody.JSONFormatted) {
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          JSONFormatted: false,
        });
      }
    }
  }

  componentDidUpdate() {
    if (this.props.newRequestBody.bodyContent === "") {
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        bodyContent: "{}",
      });
      return;
    }
    try {
      JSON.parse(this.props.newRequestBody.bodyContent);
      if (!this.props.newRequestBody.JSONFormatted) {
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          JSONFormatted: true,
        });
      }
    } catch (error) {
      if (this.props.newRequestBody.JSONFormatted) {
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          JSONFormatted: false,
        });
      }
    }
  }

  prettyPrintJSON() {
    const prettyString = JSON.stringify(
      JSON.parse(this.props.newRequestBody.bodyContent),
      null,
      4
    );
    this.props.setNewRequestBody({
      ...this.props.newRequestBody,
      bodyContent: prettyString,
    });
  }

  render() {
    const prettyPrintDisplay = {
      display: this.props.newRequestBody.JSONFormatted ? "block" : "none",
    };
    const textAreaClass = this.props.newRequestBody.JSONFormatted
      ? "composer_textarea"
      : "composer_textarea composer_textarea-error";

    return (
      <div>
        <textarea
          className={textAreaClass}
          id="jsonBodyEntryTextArea"
          style={{ resize: "none", width: "100%" }}
          type="text"
          rows={8}
          onKeyDown={(e) => this.handleKeyPress(e)}
          value={this.props.newRequestBody.bodyContent}
          placeholder="Body"
          onChange={(e) => {
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyContent: e.target.value,
            });
          }}
         />
        <div
          style={prettyPrintDisplay}
          className="composer_pretty_print"
          onClick={this.prettyPrintJSON}
        >
          JSON correctly formatted. Pretty print?
        </div>
      </div>
    );
  }
}

JSONTextArea.propTypes = {
  setNewRequestBody: PropTypes.func.isRequired,
  newRequestBody: PropTypes.object.isRequired,
};

export default JSONTextArea;
