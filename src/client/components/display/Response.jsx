import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class Response extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    // let headersArr = this.props.content.headers.map((header, index) => {
    //   console.log(header);
    //   return (<div key={index}>{header}</div>)
    // });

    let eventsArr = this.props.content.events.map((event, index) => {
      return (<div style={{'display' : 'flex'}} key={index}>
          <div style={{'width' : '50%'}}>{event.data}</div>
          <div style={{'width' : '50%'}}>{event.timeReceived}</div>
        </div>)
    });
  
    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        Response
        {/* {headersArr} */}
        {eventsArr}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Response);