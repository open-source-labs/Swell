import React from 'react';
import PropTypes from 'prop-types';

const Header = ({
  type, content, changeHandler, Key, value,
}) => (
  <div style={styles} className={`composer_header ${type === 'header' ? 'header_container' : 'cookie_container'}`}>
    ************** Header **************
    <input
      className={`composer_header_checkbox ${type === 'header' ? 'header_checkbox' : 'cookie_checkbox'}`}
      type="checkbox"
      checked={content.active}
      onChange={e => changeHandler(content.id, 'active', e.target.checked)}
    />

    <input
      className={`composer_header_input composer_header_input_first ${type === 'header' ? 'header_key' : 'cookie_key'}`}
      type="text"
      placeholder="Key"
      value={Key}
      onChange={e => changeHandler(content.id, 'key', e.target.value)}
    />

    <input
      className={`composer_header_input ${type === 'header' ? 'header_value' : 'cookie_value'}`}
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
