import React from "react";
import PropTypes from "prop-types";

const ModalNewRequest = ({imageList}) => (
  <div className = 'column' style={styles}>
      {imageList}
  </div>
);

const styles = {}

ModalNewRequest.propTypes = {
    imageList: PropTypes.array.isRequired,
};

export default ModalNewRequest;