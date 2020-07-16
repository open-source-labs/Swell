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
      <>
        <div
          className="composer_warning"
          role="button"
          tabIndex={0}
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
      </>
    );
  }
}

export default ComposerWarning;
