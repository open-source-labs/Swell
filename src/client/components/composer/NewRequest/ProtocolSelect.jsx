import React, { Component } from 'react';
import PropTypes from 'prop-types';

const classNames = require('classnames');

class ProtocolSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const HTTPSStyleClasses = classNames({
      composer_protocol_button: true,
      http: true,
      'composer_protocol_button-selected_http': (this.props.currentProtocol === '' || /https?:\/\//.test(this.props.currentProtocol)) && !this.props.graphQL && !this.props.gRPC,
    });
    const WSStyleClasses = classNames({
      composer_protocol_button: true,
      ws: true,
      'composer_protocol_button-selected_ws': /wss?:\/\//.test(this.props.currentProtocol) && !this.props.graphQL,
    });
    const GQLStyleClasses = classNames({
      composer_protocol_button: true,
      gql: true,
      'composer_protocol_button-selected_gql': this.props.graphQL,
    });
    const GRPCStyleClasses = classNames({
      composer_protocol_button: true,
      grpc: true,
      'composer_protocol_button-selected_grpc': this.props.gRPC,
    });

    return (
      <div className="composer_protocol_container">
        <div
          title="Enter an http or an https url"
          role="button"
          tabIndex={0}
          className={HTTPSStyleClasses}
          onMouseDown={() => this.props.onChangeHandler({ target: { value: 'http://' } }, 'protocol')
          }
        >
          REST
        </div>
        <div
          title="Enter WebSocket url"
          role="button"
          tabIndex={0}
          className={WSStyleClasses}
          onMouseDown={() => this.props.onChangeHandler({ target: { value: 'ws://' } }, 'protocol')}
        >
          WS
        </div>
        <div
          title="Enter a GraphQL endpoint"
          role="button"
          tabIndex={0}
          className={GQLStyleClasses}
          onMouseDown={() => this.props.onChangeHandler({ target: { value: '' } }, 'protocol', 'graphQLtrue')
          }
        >
          GRAPHQL
        </div>
        <div
          title="Enter an IP address"
          role="button"
          tabIndex={0}
          className={GRPCStyleClasses}
          onMouseDown={() => this.props.onChangeHandler({ target: { value: '' } }, 'protocol', false)
          }
        >
          GRPC
        </div>
      </div>
    );
  }
}

ProtocolSelect.propTypes = {
  currentProtocol: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
};

export default ProtocolSelect;
