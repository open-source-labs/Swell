import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import ResponseSSE from '../display/ResponseSSE.jsx';
import ResponsePlain from '../display/ResponsePlain.jsx';
import ResponseTabs from '../display/ResponseTabs.jsx';

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
        responseDisplay: this.props.connectionType,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.responseDisplay !== this.props.connectionType) {
      this.setState({
        responseDisplay: this.props.connectionType,
      });
    }
  }

  render() {
    let responseContents;
    switch (this.state.responseDisplay) {
      case 'SSE': {
        responseContents = <ResponseSSE content={this.props.content} />;
        break;
      }
      case 'plain': {
        responseContents = <ResponsePlain content={this.props.content} />;
        break;
      }
      default:
        // console.log('Sorry this is an invalid response type');
    }

    const headersArr = [];
    let index = 0;

    if (this.props.content.headers) {
      for (const header in this.props.content.headers) {
        if (Object.prototype.hasOwnProperty.call(this.props.content.headers, header)) {
          headersArr.push(
            <div className="headers nested-grid-2" key={index}>
              <div>
                <span className="tertiary-title">{header}</span>
              </div>
              <div>
                <span className="tertiary-title">{this.props.content.headers[header]}</span>
              </div>
            </div>,
          );
          index += 1;
        }
      }
    }

    return (
      <div className="resreq_res-container">
        <ResponseTabs responseContent={this.props.content} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResponseContainer);
