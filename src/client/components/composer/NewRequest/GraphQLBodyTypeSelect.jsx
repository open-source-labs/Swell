import React, { Component } from 'react';
import PropTypes from 'prop-types';

const classNames = require('classnames');

class GraphQLBodyTypeSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props)
    let RawGQLClasses = classNames({
      'composer_bodytype_button': true,
      'gql': true,
      'composer_bodytype_button-selected': this.props.newRequestBody.bodyType === 'GQLraw'
    });
    let VariableGQLClasses = classNames({
      'composer_bodytype_button': true,
      'gql': true,
      'composer_bodytype_button-selected': this.props.newRequestBody.bodyType === 'GQLvariables'
    });

    return (
      <div className={"composer_protocol_container gqlbody"} style={{ 'marginTop': '4px' }}>
        <div
          style={{ 'width': '35%' }}
          className={RawGQLClasses}
          onMouseDown={() => this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType: 'GQLraw',
          })}>
          Raw
        </div>

        <div
          style={{ 'width': '35%' }}
          className={VariableGQLClasses}
          onMouseDown={() => this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType: 'GQLvariables'
          })}>
          Variables
        </div>

      </div>
    );
  }
}

// GraphQLBodyTypeSelect.propTypes = {
//   newRequestBody: PropTypes.object.isRequired,
//   setNewRequestBody: PropTypes.func.isRequired,
// };

export default GraphQLBodyTypeSelect;