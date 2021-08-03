import React, { Component } from 'react';

class SSERow extends Component {
  constructor(props) {
    super(props);
    // this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const expandable = e.target
      .closest('.response_sse')
      .getElementsByClassName('data-inner')
      .item(0);
    const expandBtn = e.target;
    expandBtn.classList.toggle('expand-active');
    expandable.classList.toggle('expanded');
  }

  render() {
    return (
      <div className="response_sse">
        <div className="grid-4">
          <div>
            <span className="tertiary-title">
              ID {this.props.content.lastEventId}
            </span>
          </div>

          <div>
            <span className="tertiary-title">
              Event {this.props.content.type}
            </span>
          </div>

          <div>
            <span className="tertiary-title">
              Time Received {this.props.content.timeReceived}
            </span>
          </div>

          <div>
            <span
              className="tertiary-title expand-btn"
              onClick={(e) => this.handleClick(e)}
            />
          </div>
        </div>

        <div className="title-row data-inner">
          <div>
            <span className="tertiary-title">
              Data: {this.props.content.data}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default SSERow;
