import React, { Component } from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
// import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'
import dropDownArrow from '../assets/icons/arrow_drop_down_white_192x192.png'
class Prompt extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false }
    this.setState = this.setState.bind(this)
    this.show = this.show.bind(this)
    this.close = this.close.bind(this)
  }
  show() {this.setState({open: true})}
  close() {this.setState({open: false})}
  // show() {}
  // close() {}
  // const show = dimmer => () => this.setState({ dimmer, open: true }).bind(this)
  // close = () => this.setState({ open: false })

  render() {
    const { open } = this.state

    return (
      <div>
        <Button onClick={() => {this.show(true)}}>Default</Button>
        <Button onClick={() => {this.show('inverted')}}>Inverted</Button>
        <Button onClick={() => {this.show('blurring')}}>Blurring</Button>

        <Modal open={open} onClose={this.close}>
        {/* <Modal dimmer={dimmer} open={open} onClose={this.close}> */}
          <Modal.Header>Select a Photo</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' src={dropDownArrow} />
            <Modal.Description>
              <Header>Default Profile Image</Header>
              <p>We've found the following gravatar image associated with your e-mail address.</p>
              <p>Is it okay to use this photo?</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => {this.close}}>
              Nope
            </Button>
            <Button
              positive
              icon='checkmark'
              labelPosition='right'
              content="Yep, that's me"
              onClick={()=>{this.close}}
            />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default Prompt;