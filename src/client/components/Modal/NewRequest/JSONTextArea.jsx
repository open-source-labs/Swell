import React, { Component } from 'react';
import PropTypes from 'prop-types';

const classNames = require('classnames');

class JSONTextArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastParseWasSuccess: null,
    };
  }

  componentDidMount() {
    console.log('hhi');
    this.setState(
      {
        lastParseWasSuccess: true,
      },
      () => {
        if (this.props.bodyContent === '') {
          this.props.updateBodyContent({});
        }

        try {
          JSON.parse(this.props.bodyContent);
          this.props.updateJSONFormatted(true);
        }
        catch (error) {
          this.props.updateJSONFormatted(true);
        }
      },
    );
  }

  render() {
    const NoneStyleClasses = classNames({
      modal_protocol_button: true,
    });

    console.log(this.props.bodyContent);
    return (
      <div>
        <div>
          {this.props.JSONFormatted
            ? 'JSON correctly formatted.'
            : 'JSON incorrectly formatted (double quotes only).'}
        </div>
        <textarea
          style={{ resize: 'none' }}
          type="text"
          rows={8}
          value={
            this.state.lastParseWasSuccess
              ? JSON.stringify(this.props.bodyContent, undefined, 4)
              : this.props.bodyContent
          }
          placeholder="Body"
          onChange={(e) => {
            let parsedValue;
            let isJSONFormatted;
            try {
              parsedValue = JSON.parse(e.target.value);
              this.setState({
                lastParseWasSuccess: true,
              });
              isJSONFormatted = true;
            }
            catch (error) {
              console.log('error');
              parsedValue = e.target.value;
              this.setState({
                lastParseWasSuccess: false,
              });
              isJSONFormatted = false;
            }
            console.log(parsedValue);
            this.props.updateJSONFormatted(isJSONFormatted);
            this.props.updateBodyContent(parsedValue);
          }}
        />
      </div>
    );
  }
}

JSONTextArea.propTypes = {
  JSONFormatted: PropTypes.bool.isRequired,
  updateJSONFormatted: PropTypes.func.isRequired,
  bodyContent: PropTypes.string.isRequired,
  updateBodyContent: PropTypes.func.isRequired,
};

export default JSONTextArea;
