import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view'

class SSERow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick(e) {
    let expandable = e.target.closest('.response_sse').getElementsByClassName('data-inner').item(0);
    let expandBtn = e.target;

    expandBtn.classList.toggle('expand-active')
    expandable.classList.toggle('expanded');
  }


  render() {
    const json = this.props.content.data;

    return(
      <div className={'response_sse'}>
        <div className={'nested-grid-4'}>
          <div>
            <span className={'tertiary-title'}>ID {this.props.content.id}</span>
          </div>

          <div>
            <span className={'tertiary-title'}>Event {this.props.content.event}</span>
          </div>

          <div>
            <span className={'tertiary-title'}>Time Received {this.props.content.timeReceived}</span>
          </div>

          <div>
            <span onClick={(e) => this.handleClick(e)} className={'tertiary-title expand-btn'}></span>
          </div>

        </div>

        <div className={'title-row data-inner'}>
          <div>
            <span className={'tertiary-title'}>
              Data<ReactJson src={{ json }} name={false} displayDataTypes={false} />
            </span>
          </div>
        </div>

      </div>
    )
  }
}

export default SSERow;