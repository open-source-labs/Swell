import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import ResponseTabs from '../display/ResponseTabs.jsx';
import ResponseDisplay from '../display/ResponseDisplay.jsx';

const mapStateToProps = store => ({});

const mapDispatchToProps = dispatch => ({});

class ResponseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTabs: 'Response Events',
    };
    this.handleTabSelect = this.handleTabSelect.bind(this);
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

  handleTabSelect(val) {
    switch (val) {
      case 'Response Cookies':
        this.setState({
          openTabs: val,
        });
        break;
      case 'Response Headers':
        this.setState({
          openTabs: val,
        });
        break;
      case 'Response Events':
        this.setState({
          openTabs: val,
        });
        break;
      default:
      // console.log(`There was an error with ${val}`);
    }
  }

  render() {
    const headersArr = [];
    let index = 0;

    if (this.props.content.headers) {
      for (const header in this.props.content.headers) {
        if (Object.prototype.hasOwnProperty.call(this.props.content.headers, header)) {
          headersArr.push(
            <div className="headers grid-2" key={index}>
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
        <ResponseTabs responseContent={this.props.content} handleTabSelect={this.handleTabSelect} />
        <ResponseDisplay responseContent={this.props.content} openTabs={this.state.openTabs} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResponseContainer);
