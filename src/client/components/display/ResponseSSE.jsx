import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import SSERow from './SSERow.jsx';

const mapStateToProps = store => ({});

const mapDispatchToProps = dispatch => ({});

class ResponseSSE extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const SSEEventsArr = this.props.content.events.map((event, index) => (
      <SSERow key={index} content={event} />
    ));

    return (
      <div className="response_event">
        {/* ResponseSSE */}
        {SSEEventsArr}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResponseSSE);
