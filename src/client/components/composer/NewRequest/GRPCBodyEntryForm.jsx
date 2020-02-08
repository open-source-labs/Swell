import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'
import GRPCBodyStream from "./GRPCBodyStream.jsx";

class GRPCBodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
    // need to bind the 'this' of the event handler to the component instance when it is being rendered
    this.toggleShow = this.toggleShow.bind(this);
    this.onChangeUpdateStream = this.onChangeUpdateStream.bind(this);
    this.addStream = this.addStream.bind(this);
  }
  // event handler on the arrow button that allows you to open/close the section 
  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }
  // when application first loads
  componentDidMount() {
    if (this.props.newRequestStreams.streamsArr.length === 0) {
      const streamsDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestStreams.streamsArr));
      // add fist stream body to the streamsArr (streamsDeepCopy)
      streamsDeepCopy.push({
        id: this.props.newRequestStreams.count,
        query: ''
      });
      // sets the first query in the intial stream body to an empty string
      this.props.newRequestStreams.streamContent.push('')
      // update state in the store
      this.props.setNewRequestStreams({
        streamsArr: streamsDeepCopy,
        count: streamsDeepCopy.length,
        streamContent: this.props.newRequestStreams.streamContent
      });
    }
  }
  // add stream only for client or BIDIRECTIONAL streaming
  addStream() {
    const streamsArr = this.props.newRequestStreams.streamsArr;
    const streamContent = this.props.newRequestStreams.streamContent;
    // save query of initial stream body
    const firstBodyQuery = this.props.newRequestStreams.initialQuery;
    // construct new stream body obj & push into the streamsArr
    const newStream = {};
    newStream.id = this.props.newRequestStreams.count;
    newStream.query = firstBodyQuery
    streamsArr.push(newStream)
    // push query of initial stream body into streamContent array
    streamContent.push(firstBodyQuery);
    // update mew state in the store
    this.props.setNewRequestStreams({
      ...this.props.newRequestStreams,
      streamsArr: streamsArr,
      count: streamsArr.length,
      streamContent: streamContent
    });
  }
  // event handler that updates state in the store when typing into the stream query body
  onChangeUpdateStream(streamID, value) {
    const streamsArr = this.props.newRequestStreams.streamsArr;
    for (let i = 0; i < streamsArr.length; i++) {
      if (streamsArr[i].id === streamID) {
        streamsArr[streamID].query = value;
        this.props.newRequestStreams.streamContent[streamID] = value;
        this.props.setNewRequestStreams({
          ...this.props.newRequestStreams,
          streamsArr: streamsArr,
          streamContent: this.props.newRequestStreams.streamContent
        });
      };
    }
  }
  render() {
    // for each stream body in the streamArr, render the GRPCBodyStream component
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
      history={this.props.history}
    />
    ))
    // arrow button used to collapse or open the Body section
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';
    //if client stream or bidirectional, the add stream btn will be rendered below the stream bodies
    let addStreamBtn;
    if (this.props.selectedStreamingType === "CLIENT STREAM" || this.props.selectedStreamingType === "BIDIRECTIONAL") {
      addStreamBtn = (
        <div className="add-stream-btn">
         <button className="add-stream-btn button" onClick={this.addStream}>Add Stream</button>
        </div>
      )
    }
    /*
    pseudocode for the return section
     - first div renders the arrow button along with the title "Body"
     - renders the stream bodies depending on how many there are in the streamArr
     - if client stream or bidirectional, the add stream btn will be rendered below the stream bodies
     */
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