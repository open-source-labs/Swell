import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions/actions';
import PropTypes from "prop-types";

const mapStateToProps = store => ({
  newRequestBody: store.business.newRequestBody,
});

const mapDispatchToProps = dispatch => ({
  setNewRequestBody: (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
});

class GraphQLBodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    this.toggleShow = this.toggleShow.bind(this);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  render() {

    return (
      <div >
        <div className='composer_subtitle' >
          Body
        </div>

        <textarea
          value={this.props.newRequestBody.bodyContent}
          className={'composer_textarea'}
          style={{ 'resize': 'none' }} //tried making top-margin/topMargin -10px but it didn't care
          type='text'
          placeholder='Body'
          rows={10}
          onChange={(e) => {
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyContent: e.target.value
            })
          }}
        ></textarea>

      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphQLBodyEntryForm);
