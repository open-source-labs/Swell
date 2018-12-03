import React from 'react';
import PropTypes from 'prop-types';

const Header = ({
  content, changeHandler, Key, value,
}) => (
  <div style={styles} className='modal_header'>
    <input
      className='modal_header_checkbox'
      type="checkbox"
      checked={content.active}
      onChange={e => changeHandler(content.id, 'active', e.target.checked)}
    />

    <input
      className="modal_header_input modal_header_input_first"
      type="text"
      placeholder="Key"
      value={Key}
      onChange={e => changeHandler(content.id, 'key', e.target.value)}
    />

    <input
      className="modal_header_input"
      type="text"
      placeholder="Value"
      value={value}
      onChange={e => changeHandler(content.id, 'value', e.target.value)}
    />
  </div>
);

const styles = { display: 'flex' };

Header.propTypes = {
  content: PropTypes.object.isRequired,
  changeHandler: PropTypes.func.isRequired,
};

export default Header;
