import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../actions/actions";
import ResponseSSE from "../display/ResponseSSE.jsx";
import ResponsePlain from "../display/ResponsePlain.jsx";

const mapStateToProps = store => ({});

const mapDispatchToProps = dispatch => ({});

class ResponseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.state.responseDisplay !== this.props.connectionType) {
      this.setState({
        responseDisplay: this.props.connectionType
      });
    }
  }

  componentDidUpdate() {
    if (this.state.responseDisplay !== this.props.connectionType) {
      this.setState({
        responseDisplay: this.props.connectionType
      });
    }
  }

  render() {
    let responseContents;
    switch (this.state.responseDisplay) {
      case "SSE": {
        responseContents = <ResponseSSE content={this.props.content} />;
        break;
      }
      case "plain": {
        responseContents = <ResponsePlain content={this.props.content} />;
        break;
      }
    }

    let headersArr = [];
    let index = 0;
    if (this.props.content.headers) {
      for (let header in this.props.content.headers) {
        headersArr.push(<div className={'nested-grid-4'} key={index}>
          <div>{header}</div>
          <div>{this.props.content.headers[header]}</div>
        </div>);
        index++;
      }
    }
   
    return(
      <div className={'resreq_res-container'}>
        {/* ResponseContainer */}
        <div>{headersArr}</div>
        <div>{responseContents}</div>

      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResponseContainer);
