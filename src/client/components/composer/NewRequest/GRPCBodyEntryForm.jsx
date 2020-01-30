import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'
import GRPCBodyStream from "./GRPCBodyStream.jsx";

class GRPCBodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.onChangeUpdateStream = this.onChangeUpdateStream.bind(this);
    this.addStream = this.addStream.bind(this);
  }

  componentDidMount() {
    if (this.props.newRequestStreams.streamsArr.length === 0) {
      const streamsDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestStreams.streamsArr));
      streamsDeepCopy.push({
        id: this.props.newRequestStreams.count,
        active: false,
        query: ''
      });
      this.props.newRequestStreams.streamContent.push('')
      this.props.setNewRequestStreams({
        streamsArr: streamsDeepCopy,
        count: streamsDeepCopy.length,
        streamContent: this.props.newRequestStreams.streamContent
      });
    }
  }

  addStream() {
    const firstBodyContent = this.props.newRequestStreams.streamsArr[0].query;
    const count = this.props.newRequestStreams.count;
    const newStream = {};
    newStream.id = this.props.newRequestStreams.count;
    newStream.active = false;
    newStream.query = firstBodyContent;
    this.props.newRequestStreams.streamsArr.push(newStream)
    this.props.newRequestStreams.streamContent.push(`{${firstBodyContent}
}`);

    this.props.setNewRequestStreams({
      streamsArr: this.props.newRequestStreams.streamsArr,
      count: this.props.newRequestStreams.streamsArr.length,
      streamContent: this.props.newRequestStreams.streamContent
    });
  }

  onChangeUpdateStream(streamID, value) {
    let index;
    for (let i = 0; i < this.props.newRequestStreams.streamsArr.length; i++) {
      if (this.props.newRequestStreams.streamsArr[i].id === streamID) {
        index = i;
        this.props.newRequestStreams.streamsArr[index].active = true;
        this.props.newRequestStreams.streamsArr[index].query = value;
        this.props.newRequestStreams.streamContent[index] = value;
      };
    }
  this.props.setNewRequestStreams({
      ...this.props.newRequestStreams,
      streamsArr: this.props.newRequestStreams.streamsArr,
      streamContent: this.props.newRequestStreams.streamContent
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
      newRequestStreams={this.props.newRequestStreams}
      setNewRequestStreams={this.props.setNewRequestStreams}
      selectedPackage={this.props.newRequestStreams.selectedPackage}
      selectedService={this.props.selectedService}
      selectedRequest={this.props.selectedRequest}
      selectedStreamingType={this.props.selectedStreamingType}
      changeHandler={this.onChangeUpdateStream}
      stream={stream}
      key={index}
      streamNum={index}
    />
    ))
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';

    let addStreamBtn;
    if (this.props.selectedStreamingType === "CLIENT STREAM" || this.props.selectedStreamingType === "BIDIRECTIONAL") {
      addStreamBtn = (
        <div className="add-stream-btn">
         <button className="add-stream-btn button" onClick={this.addStream}>Add Stream</button>
        </div>
      )
    }

    return (
      <div >
        <div className='composer_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
          <img className={arrowClass} src={dropDownArrow}></img>
          Body
        </div>
        <section className={bodyContainerClass}>
          {streamArr}
        </section>
        {addStreamBtn}
      </div>
    );
  }
}

export default GRPCBodyEntryForm;
