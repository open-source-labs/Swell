import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';


const mapStateToProps = store => ({
});

const mapDispatchToProps = dispatch => ({});

class UpdatePopUpContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show : true,
    };
    this.toggleShow = this.toggleShow.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  toggleShow () {
    this.setState({
      show : !this.state.show,
    })
  }

  render() {

    const greyScreenClass = this.state.show ? 'grey_screen' : 'grey_screen-hide';

    return <div className={greyScreenClass}>
      <div className='update_popup'>
        There is an update available. Update?
        <button className='update_popup-btn' onClick={this.toggleShow}>
          Update
        </button>
        <button className='update_popup-btn' onClick={this.toggleShow}>
          Dismiss
        </button>
      </div>
    </div>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdatePopUpContainer);
