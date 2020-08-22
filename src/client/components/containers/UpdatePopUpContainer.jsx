import React, { Component } from "react";
import { connect } from "react-redux";

const { api } = window;

const mapDispatchToProps = (dispatch) => ({});

class UpdatePopUpContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      message: "",
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
  }

  componentDidMount() {
    api.receive("message", (e, text) => {
      this.setState({ show: true, message: text });
    });
  }

  toggleShow() {
    this.setState({
      show: !this.state.show,
    });
  }

  handleUpdateClick() {
    this.toggleShow();
    api.send("quit-and-install");
  }

  render() {
    return this.state.show ? (
      <div className="update_popup">
        <p>{this.state.message}</p>
        {this.state.message === "Update downloaded." && (
          <>
            <p className="updateMessage">
              Do you want to restart and install now? <br /> (If not, will
              auto-install on restart.)
            </p>
            <button
              className="update popup-btn"
              onClick={this.handleUpdateClick}
            >
              Update
            </button>
          </>
        )}
        <button className="dismiss popup-btn" onClick={this.toggleShow}>
          Dismiss
        </button>
      </div>
    ) : (
      <></>
    );
  }
}

export default connect(null, mapDispatchToProps)(UpdatePopUpContainer);
