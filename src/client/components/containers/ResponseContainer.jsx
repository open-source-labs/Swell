import React, { Component } from 'react';

import ResponseTabs from '../display/ResponseTabs.jsx';
import ResponseEventsDisplay from '../display/ResponseEventsDisplay.jsx';
import ResponseHeadersDisplay from '../display/ResponseHeadersDisplay.jsx';
import ResponseCookiesDisplay from '../display/ResponseCookiesDisplay.jsx';
import ResponseSubscriptionDisplay from '../display/ResponseSubscriptionDisplay.jsx';

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
        <ResponseTabs
          responseContent={this.props.content}
          handleTabSelect={this.handleTabSelect}
          openResponseTab={this.state.openTabs}
        />
        {(this.state.openTabs === 'Response Events' && this.props.subscriptionData)
          && <ResponseSubscriptionDisplay subscriptionData={this.props.subscriptionData} />
        }
        {(this.state.openTabs === 'Response Events' && !this.props.subscriptionData)
          && <ResponseEventsDisplay response={this.props.content} />
        }
        {this.state.openTabs === 'Response Headers' && <ResponseHeadersDisplay responseContent={this.props.content} />}
        {this.state.openTabs === 'Response Cookies' && <ResponseCookiesDisplay responseContent={this.props.content} />}
      </div>
    );
  }
}

export default ResponseContainer;
