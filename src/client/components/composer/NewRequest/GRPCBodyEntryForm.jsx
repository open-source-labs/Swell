import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'
import GRPCBodyStream from "./GRPCBodyStream.jsx";

class GRPCBodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      streamQuery: `  {
        test: "testing"
  }`
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.onChangeUpdateStream = this.onChangeUpdateStream.bind(this);
  }

  componentDidMount() {
    const streamsDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestStreams.streamsArr));
    this.addStream(streamsDeepCopy);
  }

  componentDidUpdate() {
    if (this.props.newRequestStreams.streamsArr.length === 0) {
      const streamsDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestStreams.streamsArr));
      this.addStream(streamsDeepCopy);
    }
  }

  addStream(streamsDeepCopy) {
    streamsDeepCopy.push({
      id: this.props.newRequestStreams.count,
      active: false,
      query: this.state.streamQuery
    });

    this.props.setNewRequestStreams({
      streamsArr: streamsDeepCopy,
      count: streamsDeepCopy.length
    });
  }

  onChangeUpdateStream(id, value) {
    const streamsDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestStreams.streamsArr));
    // find the stream in the array to update
    let indexToBeUpdated;
    for (let i = 0; i < streamsDeepCopy.length; i++) {
      if (streamsDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }
    // update query value
    streamsDeepCopy[indexToBeUpdated].query = value;
    // adds another stream query 
    if (streamsDeepCopy.length === 1) {
      this.addStream(streamsDeepCopy);
    }
    // update the store
    this.props.setNewRequestStreams({
      streamsArr: streamsDeepCopy,
      count: streamsDeepCopy.length,
    });
    
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }
 
  render() {
    const streamArr = this.props.newRequestStreams.streamsArr.map((stream, index) => (
      <GRPCBodyStream
      newRequestBody={this.props.newRequestBody}
      setNewRequestBody={this.props.setNewRequestBody}
      changeHandler={this.onChangeUpdateStream}
      content={stream}
      key={index}
      query={stream.query}
    />
    ))
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';


    return (
      <div >
        <div className='composer_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
          <img className={arrowClass} src={dropDownArrow}></img>
          Body
        </div>
        <section className={bodyContainerClass}>
          {streamArr}
        </section>
      </div>
    );
  }
}

export default GRPCBodyEntryForm;
