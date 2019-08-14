import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WWWField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ display: 'flex' }} className='composer_header'>
        <input
          type="checkbox"
          className='composer_header_checkbox'
          checked={this.props.active}
          onChange={() => {
            this.props.updateCallback(this.props.id, 'active', !this.props.active);
          }}
        />

        <input
          type="text"
          placeholder="Key"
          className="composer_header_input composer_header_input_first"
          value={this.props.Key}
          onChange={(e) => {
            this.props.updateCallback(this.props.id, 'key', e.target.value);
          }}
        />

        <input
          type="text"
          placeholder="Value"
          className="composer_header_input"
          value={this.props.value}
          onChange={(e) => {
            this.props.updateCallback(this.props.id, 'value', e.target.value);
          }}
        />
      </div>
    );
  }
}

WWWField.propTypes = {
  id: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  Key: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  updateCallback: PropTypes.func.isRequired,
};

export default WWWField;
