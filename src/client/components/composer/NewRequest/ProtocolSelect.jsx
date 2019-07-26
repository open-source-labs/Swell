import React, { Component } from 'react';
import PropTypes from 'prop-types';

const classNames = require('classnames');

class ProtocolSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const HTTPStyleClasses = classNames({
    //   composer_protocol_button: true,
    //   'composer_protocol_button-selected': this.props.currentProtocol === 'http://' && !this.props.graphQL,
    // });
    const HTTPSStyleClasses = classNames({
      composer_protocol_button: true,
      http: true,
      'composer_protocol_button-selected_http': (this.props.currentProtocol === '' || /https?:\/\//.test(this.props.currentProtocol)) && !this.props.graphQL,
    });
    const WSStyleClasses = classNames({
      composer_protocol_button: true,
      ws: true,
      'composer_protocol_button-selected_ws': this.props.currentProtocol === 'ws://',
    });
    const GQLStyleClasses = classNames({
      composer_protocol_button: true,
      gql: true,
      'composer_protocol_button-selected_gql': this.props.graphQL,
    });

    return (
      <div className="composer_protocol_container">
        {/* <div
          role="button"
          tabIndex={0}
          className={HTTPStyleClasses}
          onMouseDown={() => this.props.onChangeHandler({ target: { value: 'http://' } }, 'protocol')
          }
        >
          HTTP
        </div> */}
        <div
          role="button"
          tabIndex={0}
          className={HTTPSStyleClasses}
          onMouseDown={() => this.props.onChangeHandler({ target: { value: '' } }, 'protocol')
          // onMouseDown={() => this.props.onChangeHandler({ target: { value: 'https://' } }, 'protocol')
          }
        >
          HTTP/S
        </div>
        <div
          role="button"
          tabIndex={0}
          className={WSStyleClasses}
          onMouseDown={() => this.props.onChangeHandler({ target: { value: 'ws://' } }, 'protocol')}
        >
          WS
        </div>
        <div
          role="button"
          tabIndex={0}
          className={GQLStyleClasses}
          onMouseDown={() => this.props.onChangeHandler({ target: { value: '' } }, 'protocol', "graphQLtrue")
          }
        >
          GRAPHQL
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
