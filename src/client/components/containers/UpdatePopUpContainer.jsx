import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import * as actions from '../../actions/actions';


const mapStateToProps = store => ({
});

const mapDispatchToProps = dispatch => ({});

class UpdatePopUpContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      message: '',
    };
    this.toggleShow = this.toggleShow.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('message', (e, text) => {
      this.setState({ show: true, message: text });
    });
  }

  componentDidUpdate() {
  }

  toggleShow() {
    this.setState({
      show: !this.state.show,
    })
  }

  handleUpdateClick() {
    toggleShow();
    ipcRenderer.send('quit-and-install');
  }

  render() {

    const greyScreenClass = this.state.show ? 'grey_screen' : 'grey_screen-hide';

    return <div className={greyScreenClass}>
      <div className='update_popup'>
        <p>{this.state.message}</p>
        {this.state.message === 'Update downloaded.' &&
          <>
            <p>Do you want to restart and install now? <br /> (If not, will auto-install on restart.)</p>
            <button className='update_popup-btn' onClick={this.handleUpdateClick}>Update</button>
          </>
        }
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
