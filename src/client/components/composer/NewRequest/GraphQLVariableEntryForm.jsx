import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions/actions';

const mapStateToProps = store => ({
  newRequestBody: store.business.newRequestBody,
});

const mapDispatchToProps = dispatch => ({
  setNewRequestBody: (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
});

class GraphQLVariableEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.toggleShow = this.toggleShow.bind(this);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  render() {
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';

    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';

    return (
      <div >
        <div className='composer_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
          <img className={arrowClass} src='https://www.materialui.co/materialIcons/navigation/arrow_drop_down_white_192x192.png'>
          </img>
          Variables
        </div>

        <textarea
          value={this.props.newRequestBody.bodyVariables}
          className={'composer_textarea gql ' + bodyContainerClass }
          style={{ 'resize': 'none' }} //tried making top-margin/topMargin -10px but it didn't care
          type='text'
          placeholder='Variables'
          rows={10}
          onChange={(e) => {
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyVariables: e.target.value
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
)(GraphQLVariableEntryForm);
