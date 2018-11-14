import React from "react";
import PropTypes from "prop-types";

const ModalWarning = ({imageList}) => (
  <div className = 'column' style={styles}>
      {imageList}
  </div>
);

const styles = {}

ModalWarning.propTypes = {
    imageList: PropTypes.array.isRequired,
};

export default ModalWarning;