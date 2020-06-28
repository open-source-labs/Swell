import React, { Component } from "react";

class ComposerWarning extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.hideWarning = this.hideWarning.bind(this);
  }

  hideWarning() {
    this.props.setComposerDisplay("Request");
  }

  render() {
    return (
      <div
        role="button"
        tabIndex={0}
        style={{
          border: "1px solid black",
          margin: "3px",
          display: "flex",
          flexDirection: "column",
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            this.hideWarning();
          }
        }}
      >
        <div>{this.props.warningMessage}</div>
        <button onClick={this.hideWarning} type="button">
          Ok
        </button>
      </div>
    );
  }
}

export default ComposerWarning;
