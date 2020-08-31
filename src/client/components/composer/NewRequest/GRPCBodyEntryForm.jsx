import React, { useState, useEffect } from "react";
import GRPCBodyStream from "./GRPCBodyStream.jsx";

const GRPCBodyEntryForm = (props) => {
  const [show, toggleShow] = useState(true);

  // when application first loads
  useEffect(() => {
    if (props.newRequestStreams.streamsArr.length === 0) {
      const streamsDeepCopy = JSON.parse(
        JSON.stringify(props.newRequestStreams.streamsArr)
      );
      // add fist stream body to the streamsArr (streamsDeepCopy)
      streamsDeepCopy.push({
        id: props.newRequestStreams.count,
        query: "",
      });
      // sets the first query in the intial stream body to an empty string
      props.newRequestStreams.streamContent.push("");
      // update state in the store
      props.setNewRequestStreams({
        streamsArr: streamsDeepCopy,
        count: streamsDeepCopy.length,
        streamContent: props.newRequestStreams.streamContent,
      });
    }
  }, []);

  // add additional streams only for CLIENT or BIDIRECTIONAL streaming
  const addStream = () => {
    const streamsArr = [...props.newRequestStreams.streamsArr];
    const streamContent = [...props.newRequestStreams.streamContent];
    // save query of initial stream body
    const firstBodyQuery = props.newRequestStreams.initialQuery;
    // construct new stream body obj & push into the streamsArr
    const newStream = {};
    newStream.id = props.newRequestStreams.count;
    newStream.query = firstBodyQuery;
    streamsArr.push(newStream);
    // push query of initial stream body into streamContent array
    streamContent.push(firstBodyQuery);
    // update mew state in the store
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      streamsArr,
      count: streamsArr.length,
      streamContent,
    });
  };

  // event handler that updates state in the store when typing into the stream query body
  const onChangeUpdateStream = (streamID, value) => {
    // props.saveChanges(false);
    const streamsArr = [...props.newRequestStreams.streamsArr];
    const streamContent = [...props.newRequestStreams.streamContent];

    for (let i = 0; i < streamsArr.length; i++) {
      if (streamsArr[i].id === streamID) {
        streamsArr[streamID].query = value;
        streamContent[streamID] = value;
        props.setNewRequestStreams({
          ...props.newRequestStreams,
          streamsArr,
          streamContent,
        });
      }
    }
  };

  // for each stream body in the streamArr, render the GRPCBodyStream component
  const streamArr = props.newRequestStreams.streamsArr.map((stream, index) => (
    <GRPCBodyStream
      newRequestStreams={props.newRequestStreams}
      setNewRequestStreams={props.setNewRequestStreams}
      selectedPackage={props.newRequestStreams.selectedPackage}
      selectedService={props.selectedService}
      selectedRequest={props.selectedRequest}
      selectedStreamingType={props.selectedStreamingType}
      changeHandler={onChangeUpdateStream}
      stream={stream}
      key={index}
      streamNum={index}
      history={props.history}
    />
  ));
  const bodyContainerClass = show
    ? "composer_bodyform_container-open-grpc"
    : "composer_bodyform_container-closed";
  //if client stream or bidirectional, the add stream btn will be rendered below the stream bodies
  let addStreamBtn;
  if (
    props.selectedStreamingType === "CLIENT STREAM" ||
    props.selectedStreamingType === "BIDIRECTIONAL"
  ) {
    addStreamBtn = (
      <button className="add-stream-btn" onClick={addStream}>
        Add Stream
      </button>
    );
  }
  /*
    pseudocode for the return section
     - first div renders the arrow button along with the title "Body"
     - renders the stream bodies depending on how many there are in the streamArr
     - if client stream or bidirectional, the add stream btn will be rendered below the stream bodies
     */
  return (
    <div>
      <label className="composer_subtitle">
        <div className="label-text" id="cookie-click">
          Body
        </div>
        <div className="toggle">
          <input
            type="checkbox"
            name="check"
            className="toggle-state"
            onClick={() => toggleShow(!show)}
          />
          <div className="indicator_body" />
        </div>
      </label>

      <section className={bodyContainerClass}>{streamArr}</section>
      {addStreamBtn}
    </div>
  );
};

export default GRPCBodyEntryForm;
