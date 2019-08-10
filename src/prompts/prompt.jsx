import React, { Component } from 'react'
import ReactModal from 'react-modal';


class Prompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  componentDidUpdate() {
    "updating"
    if (this.props.isOpen !== this.state.showModal) {
      this.setState({ showModal: this.props.isOpen })
    }
  }

  render() {
    console.log('in prompt isOpen props', this.props.isOpen)
    console.log('in prompt', this.state.showModal)
    return (
      <ReactModal
        isOpen={this.state.showModal}
        className="collectionModal"
        overlayClassName="collectionModalOverlay"
        contentLabel="Minimal Modal Example"
        shouldCloseOnOverlayClick={true}
      >
        <h1>What would you like to name your collection?</h1>
          <input type={'text'} id="collectionNameInput" />
        <div>
          <button>Save</button>
          <button onClick={this.props.handleCloseModal}>Cancel</button>
        </div>
      </ReactModal>
    )
  }
}

export default Prompt;